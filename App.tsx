
import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- DATOS Y CONFIGURACIÓN ---
const TRASH_GOAL = 10;
const TRASH_LIMIT = 5;
const MISSION_TIME = 45;
const TRASH_EMOJIS = ['🍾', '🛍️', '🥫', '🥤', '🥡'];
const CREATURE_FIND_LIST = ['Camarón', 'Pez Loro', 'Caballito de Mar', 'Pez Globo', 'Pólipo de Coral'];

const CREATURE_DATA = {
    'Pulpo Sabio': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/pulpo.png', info: "Inteligente y curioso, siempre está dispuesto a resolver problemas." },
    'Coral Cerebro': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/cerebro.png', info: "Sabio y paciente. A menudo actúa como el consejero del grupo." },
    'Coral Estrella': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/estrella.png', info: "Extrovertido y optimista. ¡Siempre ilumina el día de los demás!" },
    'Pólipo de Coral': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/polipo.png', info: "Pequeño y tímido, pero muy valiente y crucial para el arrecife." },
    'Coral Cuerno de Alce': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/alce.png', info: "Un coral fuerte y protector, siempre dispuesto a defender a sus amigos y su hogar.", isCorrectCoral: true },
    'Coral Flor': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/flor.png', info: "Elegante y carismático. Irradia una sensación de belleza y tranquilidad." },
    'Esponja de Mar': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/esponja.png', info: "Las esponjas son animales simples que filtran el agua para alimentarse, ayudando a mantener el océano limpio." },
    'Camarón': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/camaron.png', info: "Los camarones limpian a otros peces y el arrecife, comiendo parásitos y algas. ¡Son los conserjes del océano!" },
    'Pez Globo': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/pez_globo.png', info: "Puede inflarse cuando se siente amenazado. Es miedoso pero valiente cuando es necesario." },
    'Pez Loro': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/loro.png', info: "Divertido y charlatán. Le gusta hacer reír a sus amigos." },
    'Caballito de Mar': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/caballito.png', info: "Su nombre en latín es Hippocampus, que significa 'caballo oruga'. Se aferran a las plantas con su cola prensil." },
    'Pez Loreto': { src: 'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/loreto.png', info: "También llamado Gramma Real. Es rápido, ágil y le encanta explorar." }
};

const QUIZ_QUESTIONS = [
    { question: "¿Quién es conocido por ser fuerte y proteger a sus amigos?", options: ["Pez Loro", "Coral Cuerno de Alce", "Pólipo de Coral"], answer: "Coral Cuerno de Alce" },
    { question: "¿Qué personaje es muy trabajador y le gusta mantener todo limpio?", options: ["Camarón", "Pez Globo", "Esponja de Mar"], answer: "Camarón" },
    { question: "¿Cuál de nuestros amigos es extrovertido y siempre optimista?", options: ["Coral Cerebro", "Pulpo Sabio", "Coral Estrella"], answer: "Coral Estrella" },
    { question: "¿Quién es el consejero sabio y paciente del grupo?", options: ["Pez Loreto", "Coral Cerebro", "Esponja de Mar"], answer: "Coral Cerebro" },
    { question: "¿Qué pez es divertido, charlatán y le gusta contar historias?", options: ["Pez Loro", "Pez Globo", "Caballito de Mar"], answer: "Pez Loro" },
];


// --- COMPONENTE DE ESTILOS GLOBALES ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Kalam:wght@700&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        .font-handwriting { font-family: 'Kalam', cursive; }
        
        #splash-screen, .ocean-bg {
            background-image: url('https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/fondo.png');
            background-size: cover;
            background-position: center;
        }

        .ocean-bg { position: relative; overflow: hidden; }

        .bubble {
            position: absolute;
            bottom: -150px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            animation: rise linear infinite;
            z-index: 2;
        }
        @keyframes rise {
            0% { transform: translateY(0); opacity: 0.8; }
            100% { transform: translateY(-120vh); opacity: 0; }
        }
        
        .trash-item {
            position: absolute;
            top: -60px;
            animation-name: fall;
            animation-timing-function: linear;
            cursor: pointer;
            z-index: 25;
        }
        @keyframes fall {
            from { transform: translateY(0); }
            to { transform: translateY(calc(100vh - 150px)); }
        }
        .accumulated-trash {
            position: absolute;
            z-index: 5;
            bottom: 60px;
            animation: settle 0.5s ease-out;
        }
        @keyframes settle {
            from { transform: translateY(-20px) scale(1.1); }
            to { transform: translateY(0) scale(1); }
        }

        .danger-alarm { animation: flash-red 0.5s 3; }
        @keyframes flash-red {
            0%, 100% { box-shadow: inset 0 0 0 0 rgba(255,0,0,0.7); }
            50% { box-shadow: inset 0 0 0 20px rgba(255,0,0,0.7); }
        }

        .creature {
            position: absolute;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, filter 0.2s;
            z-index: 10;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }
        .creature img { width: 100%; height: 100%; object-fit: contain; }
        .creature:hover { transform: scale(1.1); filter: drop-shadow(0 6px 10px rgba(0,0,0,0.4)); }
        
        .dialogue-pointer {
            content: ''; position: absolute; bottom: -20px; right: 40px;
            border-width: 20px 20px 0 0; border-style: solid; border-color: #60a5fa transparent transparent transparent;
        }
        .dialogue-pointer-inner {
            content: ''; position: absolute; bottom: -15px; right: 43px;
            border-width: 15px 15px 0 0; border-style: solid; border-color: white transparent transparent transparent;
        }
        
        .swimming-fish { animation: swim-around 11s infinite ease-in-out; }
        @keyframes swim-around {
            0% { transform: translate(0, 0) scaleX(1); }
            25% { transform: translate(40px, 20px) scaleX(1); }
            50% { transform: translate(20px, -10px) scaleX(-1); }
            75% { transform: translate(-30px, 15px) scaleX(-1); }
            100% { transform: translate(0, 0) scaleX(1); }
        }
        
        .emoji-fish {
            position: absolute;
            animation-name: swim-across;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            opacity: 0;
        }

        @keyframes swim-across {
            0% { transform: var(--transform-start); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: var(--transform-end); opacity: 0; }
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0) scale(1.1); } 20%, 80% { transform: translate3d(2px, 0, 0) scale(1.1); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0) scale(1.1); } 40%, 60% { transform: translate3d(4px, 0, 0) scale(1.1); }
        }
        .animate-shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both; }

        .breathing-animation { animation: breathe 4s ease-in-out infinite; }
        @keyframes breathe {
            0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); }
        }
        
        .active-mission-target {
            cursor: pointer;
            animation: glow 2s infinite ease-in-out;
        }
         @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 5px #fff) brightness(1); }
            50% { filter: drop-shadow(0 0 15px #a7f3d0) brightness(1.2); }
        }
        .creature:not(.active-mission-target) { pointer-events: none; }
        .creature.info-active { pointer-events: auto; }

        /* Estilos del Preloader */
        .preloader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background-color: #0c4a6e; /* Azul oscuro */
            color: white;
        }
        .preloader-bubble {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: preloader-rise 2s ease-in-out infinite;
        }
        @keyframes preloader-rise {
            0% { transform: translateY(20px); opacity: 0.5; }
            50% { transform: translateY(-20px); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0.5; }
        }
    `}</style>
);


// --- COMPONENTES AUXILIARES ---

const DialogueBox = ({ text }: { text: string }) => {
    if (!text) return null;
    return (
        <div className="absolute bottom-[200px] right-[150px] w-[220px] bg-white p-4 rounded-lg shadow-md z-20 transition-all transform opacity-100 border-2 border-blue-400">
            <p className="text-sm text-gray-700">{text}</p>
            <div className="dialogue-pointer"></div>
            <div className="dialogue-pointer-inner"></div>
        </div>
    );
};

interface CreatureProps {
  id: string;
  name: string;
  data: { src: string; info: string; isCorrectCoral?: boolean };
  style: React.CSSProperties;
  className: string;
  onClick: (name: string, data: CreatureProps['data']) => void;
  isTarget: boolean;
  isInfoActive: boolean;
}

const Creature = ({ id, name, data, style, className, onClick, isTarget, isInfoActive }: CreatureProps) => (
    <div
        id={id}
        className={`creature ${className} ${isTarget ? 'active-mission-target' : ''} ${isInfoActive ? 'info-active' : ''}`}
        style={style}
        onClick={() => onClick(name, data)}
    >
        <img src={data.src} alt={name} className="w-full h-full object-contain" />
    </div>
);


interface InfoCardData {
  name: string;
  info: string;
}

const InfoCard = ({ cardData, onClose }: { cardData: InfoCardData | null, onClose: () => void }) => {
    if (!cardData) return null;
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 z-40 transition-opacity duration-300">
            <h3 className="text-xl font-bold text-blue-800 mb-2">{cardData.name}</h3>
            <p className="text-gray-700 text-sm">{cardData.info}</p>
            <button onClick={onClose} className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow">&times;</button>
        </div>
    );
};

const LogbookModal = ({ discoveredSpecies, onClose }: { discoveredSpecies: Map<string, CreatureProps['data']>, onClose: () => void }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-8">
        <div className="bg-white rounded-2xl p-6 w-full max-w-3xl h-5/6 relative">
            <h2 className="text-3xl font-bold font-handwriting text-center mb-4 text-blue-800">Diario Marino</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto h-[calc(100%-60px)] p-2">
                {Array.from(discoveredSpecies.entries()).map(([name, data]) => (
                    <div key={name} className="flex flex-col items-center p-2 bg-blue-100 rounded-lg text-center shadow-sm">
                        <img src={data.src} alt={name} className="h-20 object-contain mb-2" />
                        <h4 className="font-bold text-sm text-blue-900">{name}</h4>
                    </div>
                ))}
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full shadow text-xl transition-transform transform hover:scale-110">&times;</button>
        </div>
    </div>
);

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

const QuizModal = ({ question, onAnswer }: { question: QuizQuestion, onAnswer: (isCorrect: boolean) => void }) => {
    const [shaking, setShaking] = useState(false);

    const handleAnswer = (isCorrect: boolean) => {
        if (!isCorrect) {
            setShaking(true);
            setTimeout(() => setShaking(false), 820);
        }
        onAnswer(isCorrect);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-40 p-4">
            <div className={`bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-lg transition-transform ${shaking ? 'animate-shake' : ''}`}>
                <p className="text-gray-700 mb-6 text-lg font-semibold">{question.question}</p>
                <div className="flex flex-col gap-3">
                    {question.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option === question.answer)}
                            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface GameResult {
  type: 'win' | 'lose';
  title: string;
  text: string;
  buttonText: string;
}

const ResultModal = ({ result, onAction }: { result: GameResult | null, onAction: () => void }) => {
    if (!result) return null;
    const isWin = result.type === 'win';
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg text-center shadow-lg transform transition-all">
                <h2 className={`text-4xl font-bold font-handwriting mb-4 ${isWin ? 'text-green-500' : 'text-red-500'}`}>{result.title}</h2>
                <p className="text-gray-700 mb-6 text-lg">{result.text}</p>
                <button
                    onClick={onAction}
                    className={`font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-md inline-flex items-center gap-2 ${isWin ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                    {result.buttonText} {isWin ? '➡️' : '🔄'}
                </button>
            </div>
        </div>
    );
};

const Bubbles = ({ count }: { count: number }) => (
    <>
        {Array.from({ length: count }).map((_, i) => {
            const size = Math.random() * 40 + 10;
            return (
                <div
                    key={i}
                    className="bubble"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 8 + 7}s`,
                        animationDelay: `${Math.random() * 10}s`,
                    }}
                />
            );
        })}
    </>
);

const EmojiFishSwarm = React.memo(() => {
    const [fishSwarm, setFishSwarm] = useState<{ id: string; emoji: string; style: React.CSSProperties; }[]>([]);

    useEffect(() => {
        const createFish = () => {
            const school = [];
            const fishEmojis = ['🐠', '🐟', '🐡'];
            const cephEmojis = ['🐙', '🦑'];
            
            for (let i = 0; i < 80; i++) {
                const directionLTR = Math.random() > 0.5;
                
                const startTransform = directionLTR ? 'translateX(-10vw) scaleX(1)' : 'translateX(110vw) scaleX(-1)';
                const endTransform = directionLTR ? 'translateX(110vw) scaleX(1)' : 'translateX(-10vw) scaleX(-1)';
                
                let emoji;
                if (Math.random() < 0.2) {
                    emoji = cephEmojis[Math.floor(Math.random() * cephEmojis.length)];
                } else {
                    emoji = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
                }
                
                school.push({
                    id: `fish-${i}`,
                    emoji: emoji,
                    style: {
                        top: `${Math.random() * 70 + 5}%`,
                        fontSize: `${Math.random() * 1.5 + 2.5}rem`,
                        '--transform-start': startTransform,
                        '--transform-end': endTransform,
                        animationDuration: `${Math.random() * 20 + 15}s`, 
                        animationDelay: `${Math.random() * 30}s`,
                    }
                });
            }
            setFishSwarm(school);
        };
        createFish();
    }, []);

    return (
        <div className="absolute inset-0 z-1 pointer-events-none">
            {fishSwarm.map(fish => (
                <div key={fish.id} className="emoji-fish" style={fish.style}>
                    {fish.emoji}
                </div>
            ))}
        </div>
    );
});

const BottomDwellers = React.memo(() => {
    const [dwellers, setDwellers] = useState<{ id: string; emoji: string; style: React.CSSProperties; }[]>([]);

    useEffect(() => {
        const createDwellers = () => {
            const bottomCreatures = [];
            const emojis = ['🐚', '🦪', '🦀'];
            for (let i = 0; i < 15; i++) {
                bottomCreatures.push({
                    id: `dweller-${i}`,
                    emoji: emojis[Math.floor(Math.random() * emojis.length)],
                    style: {
                        bottom: `${Math.random() * 3 + 1}%`,
                        left: `${Math.random() * 95}%`,
                        fontSize: `${Math.random() * 1 + 1.5}rem`,
                        animation: `breathe ${Math.random() * 2 + 3}s ease-in-out infinite`
                    }
                });
            }
            setDwellers(bottomCreatures);
        };
        createDwellers();
    }, []);

    return (
        <div className="absolute inset-0 z-5 pointer-events-none">
            {dwellers.map(dweller => (
                <div key={dweller.id} className="absolute" style={dweller.style}>
                    {dweller.emoji}
                </div>
            ))}
        </div>
    );
});

const Preloader = () => (
    <div className="preloader">
        <div className="preloader-bubble"></div>
        <p className="mt-4 text-xl font-handwriting">Cargando Aventura...</p>
    </div>
);


// --- COMPONENTE PRINCIPAL ---
export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [gameState, setGameState] = useState('splash'); // splash, trash, coral, find, quiz, end
    const [dialogue, setDialogue] = useState('');
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(MISSION_TIME);
    const [accumulatedTrash, setAccumulatedTrash] = useState(0);
    const [trashItems, setTrashItems] = useState<{ id: number; emoji: string; style: React.CSSProperties; }[]>([]);
    const [missionTarget, setMissionTarget] = useState<string | null>(null);
    const [quizIndex, setQuizIndex] = useState(0);
    const [infoCardData, setInfoCardData] = useState<InfoCardData | null>(null);
    const [discoveredSpecies, setDiscoveredSpecies] = useState<Map<string, CreatureProps['data']>>(new Map());
    const [showLogbook, setShowLogbook] = useState(false);
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [isInfoActive, setIsInfoActive] = useState(false);
    const gameContainerRef = useRef<HTMLDivElement>(null);

    // Preloader de imágenes
    useEffect(() => {
        const imageUrls = [
            'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/fondo.png',
            'https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/arena.png',
            ...Object.values(CREATURE_DATA).map(c => c.src)
        ];

        const preloadImages = (urls: string[]) => {
            const promises = urls.map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            });
            return Promise.all(promises);
        };

        preloadImages(imageUrls)
            .then(() => {
                setTimeout(() => setIsLoading(false), 1500); // Pequeño delay para una transición más suave
            })
            .catch(err => console.error("Fallo al precargar las imágenes", err));
    }, []);

    const audioRefs = {
        bgMusic: useRef<HTMLAudioElement>(null), sfxClick: useRef<HTMLAudioElement>(null), sfxWin: useRef<HTMLAudioElement>(null),
        sfxLose: useRef<HTMLAudioElement>(null), sfxCorrect: useRef<HTMLAudioElement>(null)
    };

    const playSfx = (soundRef: React.RefObject<HTMLAudioElement>) => {
        if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play().catch(e => {});
        }
    };
    
    const showDialogue = (text: string, duration = 4000) => {
        setDialogue(text);
        if (duration > 0) {
            setTimeout(() => setDialogue(''), duration);
        }
    };

    const handleStartGame = () => {
        playSfx(audioRefs.sfxClick);
        if (audioRefs.bgMusic.current) {
            audioRefs.bgMusic.current.volume = 0.2;
            audioRefs.bgMusic.current.play().catch(e => {});
        }
        setIsInfoActive(true);
        setGameState('trash');
    };

    const resetGame = () => {
        setGameResult(null);
        setGameState('splash');
        setScore(0);
        setTimer(MISSION_TIME);
        setAccumulatedTrash(0);
        setTrashItems([]);
        setQuizIndex(0);
        setIsInfoActive(false);
    };

    // Lógica de la misión de basura
    useEffect(() => {
        if (gameState !== 'trash') return;

        showDialogue('¡El arrecife necesita tu ayuda! Recoge 10 objetos antes de que el tiempo acabe.');
        setScore(0);
        setTimer(MISSION_TIME);
        setAccumulatedTrash(0);
        setTrashItems([]);

        const trashInterval = setInterval(() => {
            setTrashItems(prev => [...prev, {
                id: Date.now() + Math.random(),
                emoji: TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)],
                style: {
                    left: `${Math.random() * 90 + 5}%`,
                    animationDuration: `${Math.random() * 4 + 5}s`
                }
            }]);
        }, 1200);

        const timerInterval = setInterval(() => {
            setTimer(t => t > 0 ? t - 1 : 0);
        }, 1000);

        return () => {
            clearInterval(trashInterval);
            clearInterval(timerInterval);
        };
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'trash') {
            if (score >= TRASH_GOAL) {
                playSfx(audioRefs.sfxWin);
                showDialogue('¡Genial! Has limpiado la basura. Ahora, la siguiente fase...', 3000);
                setTimeout(() => setGameState('coral'), 3100);
            } else if (accumulatedTrash >= TRASH_LIMIT || timer <= 0) {
                playSfx(audioRefs.sfxLose);
                if(gameContainerRef.current) {
                    gameContainerRef.current.classList.add('danger-alarm');
                    setTimeout(() => gameContainerRef.current?.classList.remove('danger-alarm'), 1500);
                }
                setGameResult({ type: 'lose', title: '¡Misión Fallida!', text: '¡Oh no! El arrecife se contaminó.', buttonText: 'Intentar de Nuevo' });
            }
        }
    }, [score, accumulatedTrash, timer, gameState]);


    const handleTrashClick = (id: number) => {
        playSfx(audioRefs.sfxClick);
        setTrashItems(items => items.filter(item => item.id !== id));
        setScore(s => s + 1);
    };

    const handleTrashAnimationEnd = (id: number) => {
        setTrashItems(items => items.filter(item => item.id !== id));
        setAccumulatedTrash(at => at + 1);
    };
    
    useEffect(() => {
        if (gameState !== 'coral') return;
        showDialogue('¡Excelente! Ahora, identifica el Coral Cuerno de Alce.');
        setMissionTarget(null);
    }, [gameState]);

    const handleCreatureClick = useCallback((name: string, data: CreatureProps['data']) => {
        if (gameState === 'coral') {
            if (data.isCorrectCoral) {
                playSfx(audioRefs.sfxCorrect);
                showDialogue('¡Correcto! ¡Ese es el Coral Cuerno de Alce!', 3000);
                setTimeout(() => setGameState('find'), 3100);
            } else {
                playSfx(audioRefs.sfxLose);
                showDialogue('Ese no es. Sigue intentando...', 2000);
            }
        } else if (gameState === 'find' && name === missionTarget) {
            playSfx(audioRefs.sfxCorrect);
            const nextIndex = CREATURE_FIND_LIST.indexOf(missionTarget) + 1;
            if (nextIndex >= CREATURE_FIND_LIST.length) {
                showDialogue('¡Lo lograste! Ahora habla con nuestro amigo el Pulpo Sabio.', 0);
                setTimeout(() => setGameState('quiz'), 2000);
            } else {
                showDialogue(`¡Excelente! Encontraste al ${missionTarget}.`, 2000);
                setTimeout(() => {
                    const nextCreature = CREATURE_FIND_LIST[nextIndex];
                    setMissionTarget(nextCreature);
                    showDialogue(`Ahora, encuentra al ${nextCreature}.`);
                }, 2100);
            }
        } else if (gameState === 'quiz' && name === 'Pulpo Sabio') {
            playSfx(audioRefs.sfxClick);
            setMissionTarget(null);
        } else if (isInfoActive) {
            playSfx(audioRefs.sfxClick);
            setInfoCardData({ name, ...data });
            if (!discoveredSpecies.has(name)) {
                setDiscoveredSpecies(prevMap => new Map(prevMap).set(name, data));
            }
        }
    }, [gameState, missionTarget, discoveredSpecies, isInfoActive]);
    
    useEffect(() => {
        if (gameState !== 'find') return;
        const firstCreature = CREATURE_FIND_LIST[0];
        setMissionTarget(firstCreature);
        showDialogue(`¡Muy bien! Ahora, ¿puedes encontrar al ${firstCreature}?`);
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'quiz') return;
        showDialogue('Habla con el Pulpo Sabio para empezar el cuestionario final.');
        setMissionTarget('Pulpo Sabio');
    }, [gameState]);
    
    const handleQuizAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            playSfx(audioRefs.sfxCorrect);
            const nextQuizIndex = quizIndex + 1;
            if (nextQuizIndex >= QUIZ_QUESTIONS.length) {
                setGameState('end');
                showDialogue('¡Fantástico! Sabes mucho sobre el arrecife.', 0);
                setTimeout(() => {
                    setGameResult({ type: 'win', title: '¡Aventura Completada!', text: '¡Has superado todos los retos! Eres un verdadero Guardián del Mar.', buttonText: 'Jugar de Nuevo' });
                }, 1000);
            } else {
                setQuizIndex(nextQuizIndex);
            }
        } else {
            playSfx(audioRefs.sfxLose);
        }
    };


    // --- RENDERIZADO ---
    return (
        <div className="w-screen h-screen bg-blue-900 flex items-center justify-center font-sans">
            <GlobalStyles />
            <div ref={gameContainerRef} className="w-full max-w-4xl h-[90vh] max-h-[600px] bg-blue-800 rounded-2xl shadow-2xl overflow-hidden relative">
                {isLoading ? (
                    <Preloader />
                ) : gameState === 'splash' ? (
                     <div id="splash-screen" className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                        <h1 className="text-6xl md:text-7xl font-bold font-handwriting mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Reto Marino</h1>
                        <p className="text-xl md:text-2xl mb-8" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Una Aventura Interactiva del Caribe</p>
                        <button onClick={handleStartGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-xl transition-all transform hover:scale-110 shadow-xl border-4 border-blue-300">
                            ¡Iniciar Aventura! 🌊
                        </button>
                    </div>
                ) : (
                    <main className="w-full h-full ocean-bg">
                        <Bubbles count={20} />
                        <EmojiFishSwarm />
                        <BottomDwellers />
                        <div className={`absolute top-4 left-4 bg-white/30 backdrop-blur-sm p-3 rounded-xl z-30 text-center transition-opacity duration-300 ${gameState !== 'trash' ? 'opacity-0' : 'opacity-100'}`}>
                            <h2 className="font-bold text-white text-lg">Tiempo Restante</h2>
                            <p className="text-white text-2xl font-bold">{timer}</p>
                        </div>
                        <div className={`absolute top-4 right-4 bg-white/30 backdrop-blur-sm p-3 rounded-xl z-30 text-center transition-opacity duration-300 ${gameState !== 'trash' ? 'opacity-0' : 'opacity-100'}`}>
                            <h2 className="font-bold text-white text-lg">Basura Recogida</h2>
                            <p className="text-white text-2xl font-bold">{score} / {TRASH_GOAL}</p>
                        </div>
                        <button onClick={() => setShowLogbook(true)} className="absolute bottom-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold p-3 rounded-full shadow-lg z-30 transform hover:scale-110 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
                        </button>
                        
                        <DialogueBox text={dialogue} />
                        
                        <div id="sea-creatures-layer">
                            <Creature id="octopus" name="Pulpo Sabio" data={CREATURE_DATA['Pulpo Sabio']} style={{ width: '15.6rem', bottom: '3rem', left: '2%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={missionTarget === 'Pulpo Sabio'} isInfoActive={isInfoActive} />
                            <Creature id="coral-estrella" name="Coral Estrella" data={CREATURE_DATA['Coral Estrella']} style={{ width: '7rem', bottom: '0.5rem', left: '23%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={false} isInfoActive={isInfoActive} />
                            <Creature id="coral-cuerno-de-alce" name="Coral Cuerno de Alce" data={CREATURE_DATA['Coral Cuerno de Alce']} style={{ width: '9rem', bottom: '3.5rem', left: '32%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={gameState === 'coral'} isInfoActive={isInfoActive} />
                            <Creature id="coral-flor" name="Coral Flor" data={CREATURE_DATA['Coral Flor']} style={{ width: '7rem', bottom: '0.5rem', left: '46%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={gameState === 'coral'} isInfoActive={isInfoActive} />
                            <Creature id="polipo" name="Pólipo de Coral" data={CREATURE_DATA['Pólipo de Coral']} style={{ width: '2.5rem', bottom: '1rem', left: '55.5%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={missionTarget === 'Pólipo de Coral'} isInfoActive={isInfoActive} />
                            <Creature id="coral-cerebro" name="Coral Cerebro" data={CREATURE_DATA['Coral Cerebro']} style={{ width: '8rem', bottom: '3rem', left: '59%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={gameState === 'coral'} isInfoActive={isInfoActive} />
                            <Creature id="guide-sponge" name="Esponja de Mar" data={CREATURE_DATA['Esponja de Mar']} style={{ width: '11.7rem', bottom: '0.5rem', right: '11%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={false} isInfoActive={isInfoActive} />
                            <Creature id="camaron" name="Camarón" data={CREATURE_DATA['Camarón']} style={{ width: '9rem', bottom: '1rem', right: '2%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={missionTarget === 'Camarón'} isInfoActive={isInfoActive} />
                            <Creature id="pez-globo" name="Pez Globo" data={CREATURE_DATA['Pez Globo']} style={{ width: '8rem', top: '22%', left: '18%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={missionTarget === 'Pez Globo'} isInfoActive={isInfoActive} />
                            <Creature id="pez-loro" name="Pez Loro" data={CREATURE_DATA['Pez Loro']} style={{ width: '13rem', top: '18%', left: '38%' }} className="swimming-fish" onClick={handleCreatureClick} isTarget={missionTarget === 'Pez Loro'} isInfoActive={isInfoActive} />
                            <Creature id="caballito-de-mar" name="Caballito de Mar" data={CREATURE_DATA['Caballito de Mar']} style={{ width: '5rem', top: '20%', right: '28%' }} className="breathing-animation" onClick={handleCreatureClick} isTarget={missionTarget === 'Caballito de Mar'} isInfoActive={isInfoActive} />
                            <Creature id="pez-loreto" name="Pez Loreto" data={CREATURE_DATA['Pez Loreto']} style={{ width: '8rem', top: '38%', right: '15%' }} className="swimming-fish" onClick={handleCreatureClick} isTarget={missionTarget === 'Pez Loreto'} isInfoActive={isInfoActive} />
                        </div>

                        {gameState === 'trash' && (
                            <div id="trash-container" className="z-20">
                                {trashItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="trash-item text-4xl hover:scale-125 transition-transform"
                                        style={item.style}
                                        onClick={() => handleTrashClick(item.id)}
                                        onAnimationEnd={() => handleTrashAnimationEnd(item.id)}
                                    >
                                        {item.emoji}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <img src="https://raw.githubusercontent.com/NucleoColectivo/Juego_Oceano/main/personajes/png/arena.png" alt="Fondo de arena" className="absolute bottom-0 left-0 w-full h-auto max-h-24 z-0 pointer-events-none" />

                        {infoCardData && <InfoCard cardData={infoCardData} onClose={() => setInfoCardData(null)} />}
                        {showLogbook && <LogbookModal discoveredSpecies={discoveredSpecies} onClose={() => setShowLogbook(false)} />}
                        {gameState === 'quiz' && missionTarget === null && <QuizModal question={QUIZ_QUESTIONS[quizIndex]} onAnswer={handleQuizAnswer} />}
                        {gameResult && <ResultModal result={gameResult} onAction={gameResult?.type === 'lose' ? () => { setGameResult(null); setGameState('trash'); } : resetGame} />}
                    </main>
                )}
                <audio ref={audioRefs.bgMusic} loop src="https://cdn.jsdelivr.net/gh/k-d-d-d/sounds@master/zapsplat_nature_underwater_ocean_calm_ambience_001_12061.mp3" preload="auto" crossOrigin="anonymous"></audio>
                <audio ref={audioRefs.sfxClick} src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_242188a14b.mp3" preload="auto" crossOrigin="anonymous"></audio>
                <audio ref={audioRefs.sfxWin} src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_8b24b2236a.mp3" preload="auto" crossOrigin="anonymous"></audio>
                <audio ref={audioRefs.sfxLose} src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3ffc99187.mp3" preload="auto" crossOrigin="anonymous"></audio>
                <audio ref={audioRefs.sfxCorrect} src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_29b2cf988f.mp3" preload="auto" crossOrigin="anonymous"></audio>
            </div>
        </div>
    );
}
