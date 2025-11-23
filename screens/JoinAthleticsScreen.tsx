import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAIFeedback } from '../services/geminiService';
import Header from '../components/Header';
import { AthleticsIcon, CricketIcon, FootballIcon, BadmintonIcon, KabaddiIcon } from '../components/icons/SportIcons';

type Step = 
  | 'chooseSport'
  | 'fitnessInstructions'
  | 'recordFitness'
  | 'analyzingFitness'
  | 'sportInstructions'
  | 'recordSport'
  | 'processing'
  | 'results';

const sports = [
  { name: 'Cricket', icon: CricketIcon },
  { name: 'Football', icon: FootballIcon },
  { name: 'Badminton', icon: BadmintonIcon },
  { name: 'Athletics', icon: AthleticsIcon },
  { name: 'Kabaddi', icon: KabaddiIcon },
];

const fitnessInstructions = [
    "Video length should be between 5-6 minutes.",
    "Keep the camera steady and record in landscape mode for best results.",
    "Complete the following exercises in sequence:",
    "1. 100 Meter Sprint (Aim for 15-20 seconds)",
    "2. 10 Push-ups (Aim to complete in 15-20 seconds)",
    "3. Long Jump (Aim for a distance of 8-15 feet)",
    "Ensure all actions are fully visible in the frame for accurate analysis.",
];

const sportInstructions: Record<string, string[]> = {
    'Athletics': [
        "Running: Record your sprint form, focusing on stride length and start/finish posture.", 
        "Long Jump: Demonstrate your approach run, take-off angle, and landing technique.",
        "Ensure all movements are clear and unobstructed."
    ],
    'Cricket': [
        "Batting: Record your batting shots from both front and side views.", 
        "Bowling: Show your full run-up and bowling action clearly.", 
        "Fielding: Capture your throw accuracy and movement during fielding drills."
    ],
    'Football': [
        "Dribbling: Record a sequence of dribbling in a straight line and then in a zigzag pattern.", 
        "Shooting: Perform 5-10 shots at a target.", 
        "Agility: Showcase sprint and direction-change actions."
    ],
    'Badminton': ["Record yourself practicing 10 smash shots.", "Demonstrate your footwork around the court.", "Serve 5 times to different corners."],
    'Kabaddi': ["Record a 1-minute raiding drill.", "Demonstrate 3 defensive holds (e.g., ankle hold).", "Showcase your agility and footwork."],
};


const processingMessages = [
  "Extracting frames...", "Identifying body keypoints...", "Analyzing technique...", "Calculating performance metrics...", "Generating score...", "Compiling AI feedback...",
];


const VideoRecorder: React.FC<{ onRecordingComplete: (blob: Blob) => void; duration: number; }> = ({ onRecordingComplete, duration }) => {
    type Status = 'idle' | 'initializing' | 'recording' | 'error';

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    const cleanupStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const permissionDeniedMessage = "Camera and Microphone access denied. Please enable permissions for both in your browser settings and try again.";

    const initCamera = useCallback(async () => {
        setStatus('initializing');
        setError(null);
        cleanupStream();

        if (!navigator.mediaDevices?.getUserMedia) {
            setError("Camera access is not supported by your browser.");
            setStatus('error');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.muted = true; 
                await videoRef.current.play();
            }
            setStatus('idle');
        } catch (err) {
            console.error("Error accessing media devices:", err);
            cleanupStream();
             if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                setError(permissionDeniedMessage);
            } else if (err instanceof Error && (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')) {
                setError("No camera or microphone found. Please ensure they are connected and available.");
            } else {
                setError("An unexpected error occurred while accessing your media devices.");
            }
            setStatus('error');
        }
    }, [cleanupStream]);

    useEffect(() => {
        const checkPermissions = async () => {
            if (navigator.permissions?.query) {
                try {
                    const cameraStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
                    const microphoneStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                    if (cameraStatus.state === 'denied' || microphoneStatus.state === 'denied') {
                        setError(permissionDeniedMessage);
                        setStatus('error');
                    }
                } catch (e) {
                     console.error("Could not query media device permissions", e);
                }
            }
        };
        checkPermissions();
    }, []);


    const handleStartRecording = useCallback(() => {
        if (!streamRef.current) {
            initCamera().then(() => {
                 if (streamRef.current) {
                    startMediaRecorder(streamRef.current);
                 }
            })
            return;
        }
        startMediaRecorder(streamRef.current);
    }, [initCamera]);

    const startMediaRecorder = (stream: MediaStream) => {
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) chunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            onRecordingComplete(blob);
            cleanupStream();
        };
        
        recorder.start();
        setElapsedTime(0);
        setStatus('recording');
    }

    const handleStopRecording = useCallback(() => {
        if (mediaRecorderRef.current && status === 'recording') {
            mediaRecorderRef.current.stop();
            setStatus('idle');
        }
    }, [status]);
    
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'recording') {
            interval = setInterval(() => {
                setElapsedTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= duration) {
                        handleStopRecording();
                        return duration;
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, duration, handleStopRecording]);

    useEffect(() => {
        return () => cleanupStream();
    }, [cleanupStream]);


    const renderContent = () => {
        switch (status) {
            case 'error':
                return (
                    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 text-center bg-gray-100 rounded-lg shadow-xl">
                        <svg xmlns="http://www.w.org/2000/svg" className="w-16 h-16 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mb-2 text-xl font-bold text-gray-800">Camera Error</h3>
                        <p className="mb-6 text-gray-600">{error}</p>
                        <button onClick={initCamera} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                            Try Again
                        </button>
                    </div>
                );
            case 'initializing':
                return (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 mb-4 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600">Initializing Camera...</p>
                        <p className="mt-2 text-sm text-gray-500">Please grant permission when prompted.</p>
                    </div>
                );
            default: // idle or recording
                return (
                    <>
                        <div className="relative w-full mb-4 bg-black rounded-lg aspect-video">
                            <video ref={videoRef} playsInline className="object-cover w-full h-full rounded-lg"></video>
                            {status === 'recording' && <div className="absolute top-2 right-2 bg-red-500 rounded-full h-4 w-4 animate-pulse"></div>}
                            {status === 'idle' && !streamRef.current && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                                     <button onClick={initCamera} className="flex flex-col items-center justify-center p-4 space-y-2 text-white bg-white/20 rounded-lg backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-semibold">Start Camera</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="mb-4 font-mono text-lg">
                            {String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:{String(elapsedTime % 60).padStart(2, '0')} / {String(Math.floor(duration / 60)).padStart(2, '0')}:{String(duration % 60).padStart(2, '0')}
                        </p>
                        {status !== 'recording' ? (
                            <button onClick={handleStartRecording} disabled={!streamRef.current} className="px-6 py-3 font-bold text-white bg-green-600 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">Start Recording</button>
                        ) : (
                            <button onClick={handleStopRecording} className="px-6 py-3 font-bold text-white bg-red-600 rounded-full shadow-lg">Stop Recording</button>
                        )}
                    </>
                );
        }
    }

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full h-full p-4 bg-white">
            {renderContent()}
        </div>
    );
};

const UploadStepper: React.FC<{ currentStage: 'fitness' | 'sport' | 'analysis' }> = ({ currentStage }) => {
    const stages = [
        { key: 'fitness', label: 'Fitness Test' },
        { key: 'sport', label: 'Sport Test' },
        { key: 'analysis', label: 'AI Analysis' },
    ];
    const currentIndex = stages.findIndex(s => s.key === currentStage);

    return (
        <div className="flex items-center w-full">
            {stages.map((stage, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                return (
                    <React.Fragment key={stage.key}>
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span className={`ml-2 font-semibold transition-colors duration-300 ${isActive ? 'text-blue-800' : 'text-gray-500'}`}>{stage.label}</span>
                        </div>
                        {index < stages.length - 1 && <div className={`flex-1 h-1 mx-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const AnalyzingScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full flex-1 p-8 text-gray-800">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-lg text-gray-700">{message}</p>
        <p className="text-sm text-gray-500 mt-2">This will take a moment.</p>
    </div>
);

const JoinAthleticsScreen: React.FC = () => {
  const [step, setStep] = useState<Step>('chooseSport');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [scores, setScores] = useState({ final: 0, technique: 0, speed: 0, accuracy: 0 });
  const [aiFeedback, setAiFeedback] = useState('');

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setStep('fitnessInstructions');
  };
  
  const handleFitnessRecordingComplete = (blob: Blob) => {
    setStep('analyzingFitness');
  };
  
  const handleSportRecordingComplete = (blob: Blob) => {
      setStep('processing');
      setProcessingIndex(0);
  };
  
  useEffect(() => {
    if (step === 'analyzingFitness') {
        const analysisTimer = setTimeout(() => {
            // Streamlined flow: Directly transition to the sport instructions after analysis.
            setStep('sportInstructions');
        }, 3000); // Simulate 3s analysis
        return () => clearTimeout(analysisTimer);
    }

    let interval: ReturnType<typeof setInterval>;
    if (step === 'processing' && processingIndex < processingMessages.length) {
      interval = setInterval(() => {
        setProcessingIndex(prev => prev + 1);
      }, 1500);
    } else if (step === 'processing' && processingIndex >= processingMessages.length) {
      const fetchFeedback = async () => {
          const feedback = await getAIFeedback(selectedSport || "Athletics");
          setAiFeedback(feedback);
          setScores({
              final: Math.floor(Math.random() * 15) + 80,
              technique: Math.floor(Math.random() * 15) + 80,
              speed: Math.floor(Math.random() * 15) + 80,
              accuracy: Math.floor(Math.random() * 15) + 80,
          });
          setStep('results');
      };
      fetchFeedback();
    }
    return () => clearInterval(interval);
  }, [step, processingIndex, selectedSport]);


  const resetProcess = () => {
    setStep('chooseSport');
    setSelectedSport(null);
    setAiFeedback('');
    setScores({ final: 0, technique: 0, speed: 0, accuracy: 0 });
  };
  
  const CardButton: React.FC<{onClick: () => void, icon: React.FC<React.SVGProps<SVGSVGElement>>, label: string}> = ({ onClick, icon: Icon, label}) => (
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 bg-blue-900 text-white rounded-xl shadow-md hover:bg-blue-800 transition-colors aspect-square"
      >
        <Icon className="w-10 h-10 mb-2" />
        <span className="font-semibold text-center">{label}</span>
      </button>
  );

  const InstructionsContent: React.FC<{title: string; instructions: string[]; onNext: () => void;}> = ({ title, instructions, onNext }) => (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto flex flex-col">
         <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
         <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 bg-gray-100 p-4 rounded-lg">
             {instructions.map((inst, index) => <li key={index}>{inst}</li>)}
         </ul>
         <div className="mt-auto pt-4">
             <button onClick={onNext} className="w-full py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                Proceed to Record
            </button>
         </div>
    </div>
  );

  const renderUploadFlow = () => {
    const isFitnessStage = ['fitnessInstructions', 'recordFitness', 'analyzingFitness'].includes(step);
    const stage: 'fitness' | 'sport' = isFitnessStage ? 'fitness' : 'sport';

    const handleBack = () => {
        if (step === 'fitnessInstructions') setStep('chooseSport');
        if (step === 'recordFitness') setStep('fitnessInstructions');
        if (step === 'sportInstructions') setStep('fitnessInstructions'); // Go back to fitness instructions from sport
        if (step === 'recordSport') setStep('sportInstructions');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header title="Submit Performance" onBack={handleBack} />
            <div className="p-4 border-b border-gray-200">
                <UploadStepper currentStage={stage} />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                {step === 'fitnessInstructions' && <InstructionsContent title="Step 1: Fitness Test" instructions={fitnessInstructions} onNext={() => setStep('recordFitness')} />}
                {step === 'recordFitness' && <VideoRecorder onRecordingComplete={handleFitnessRecordingComplete} duration={360} />}
                {step === 'analyzingFitness' && <AnalyzingScreen message="Analyzing Fitness Video..." /> }
                {step === 'sportInstructions' && <InstructionsContent title={`Step 2: ${selectedSport} Test`} instructions={sportInstructions[selectedSport || 'Athletics']} onNext={() => setStep('recordSport')} />}
                {step === 'recordSport' && <VideoRecorder onRecordingComplete={handleSportRecordingComplete} duration={360} />}
            </div>
        </div>
    );
  };


  const renderContent = () => {
    switch(step) {
      case 'chooseSport':
        return (
          <>
            <Header title="Join Athletics" />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Sport</h2>
              <div className="grid grid-cols-3 gap-4">
                {sports.map(sport => (
                  <CardButton key={sport.name} onClick={() => handleSportSelect(sport.name)} icon={sport.icon} label={sport.name} />
                ))}
              </div>
            </div>
          </>
        );
      case 'fitnessInstructions':
      case 'recordFitness':
      case 'analyzingFitness':
      case 'sportInstructions':
      case 'recordSport':
        return renderUploadFlow();
      case 'processing':
      case 'results':
          return (
             <div className="flex flex-col flex-1 bg-blue-900 text-white">
                <header className="p-4 flex items-center h-[65px]">
                    {step === 'results' && 
                        <button onClick={resetProcess} className="p-2 rounded-full hover:bg-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    }
                    <h1 className="text-xl font-bold mx-auto">SPARK KHOJ</h1>
                </header>
                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center h-full flex-1 p-8">
                        <div className="p-4 mb-4"><UploadStepper currentStage="analysis" /></div>
                        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-6"></div>
                        <p className="text-lg text-blue-200">AI Analysis in Progress</p>
                        <div className="mt-8 text-center text-blue-100"><p>{processingMessages[processingIndex] || 'Finalizing...'}</p></div>
                    </div>
                )}
                {step === 'results' && (
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        <div className="text-center">
                            <h3 className="text-lg text-blue-200">Your Score</h3>
                            <p className="text-8xl font-bold">{scores.final}</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">AI Feedback</h4>
                            <div className="bg-blue-800 p-4 rounded-lg"><p className="text-sm whitespace-pre-wrap">{aiFeedback}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-800 p-4 rounded-lg text-center"><p className="text-blue-200">Technique</p><p className="text-2xl font-bold">{scores.technique}</p></div>
                            <div className="bg-blue-800 p-4 rounded-lg text-center"><p className="text-blue-200">Acceleration</p><p className="text-2xl font-bold">{scores.speed}</p></div>
                        </div>
                        <button onClick={resetProcess} className="w-full mt-2 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-sm">Analyze Another Video</button>
                    </div>
                )}
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-full flex flex-col">
      {renderContent()}
    </div>
  );
};

export default JoinAthleticsScreen;
