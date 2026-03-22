/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  RefreshCcw,
  Volume2,
  VolumeX,
  Star,
  Trophy,
  Smile,
  Frown,
  Volume1,
  Sparkles,
  ArrowRight,
  Heart,
  User,
  ListOrdered,
  ChevronLeft
} from 'lucide-react';
import { QUESTIONS } from './constants';

export default function App() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleStart = () => setStep('quiz');

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview-tts",
        contents: [{ parts: [{ text: `Prečítaj milým, rozprávkovým hlasom pre deti: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS failed:", error);
      setIsSpeaking(false);
    }
  };

  const handleAnswer = (userAnswer: boolean) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.answer;
    
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setLastAnswerCorrect(null);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setLastAnswerCorrect(null);
  };

  return (
    <div className="min-h-screen bubble-bg relative flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Decorative Floating Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-10 left-10 text-[#FFD93D] opacity-20"
        >
          <Sparkles size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-10 right-10 text-[#6BCB77] opacity-20"
        >
          <Heart size={100} fill="currentColor" />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="max-w-2xl w-full z-10 text-center"
          >
            <div className="kid-card">
              <motion.div className="inline-block mb-6 text-8xl animate-wiggle">🦊</motion.div>
              <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-[#4A3728]">Ryška</h1>
              <p className="text-2xl md:text-3xl text-[#7A6352] font-medium mb-12 leading-relaxed">
                Ahoj, <span className="text-[#4D96FF] font-black">KAMARÁTI</span>! 👋 <br/>
                Pomôžete Ryške zistiť, čo je <span className="text-[#6BCB77] font-bold">PRAVDA</span> a čo je <span className="text-[#FF6B6B] font-bold">LEŽ</span>?
              </p>

              <button onClick={handleStart} className="btn-truth flex items-center justify-center gap-4 mx-auto">
                POĎME NA TO! <ArrowRight size={32} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-3xl w-full z-10"
          >
            <div className="mb-8 flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-white px-6 py-2 rounded-full shadow-md border-2 border-[#FFD93D] flex items-center gap-2">
                <Star size={24} className="text-[#FFD93D]" fill="currentColor" />
                <span className="text-2xl font-display font-bold">{score}</span>
              </div>
            </div>

            <div className="kid-card text-center relative">
              <div className="flex justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => speakText(QUESTIONS[currentQuestionIndex].text)}
                  disabled={isSpeaking}
                  className={`p-5 rounded-full shadow-md transition-all ${isSpeaking ? 'bg-gray-100 text-gray-400' : 'bg-[#4D96FF]/20 text-[#4D96FF] border-2 border-[#4D96FF]'}`}
                >
                  <Volume1 size={40} />
                </motion.button>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-16 leading-tight text-[#4A3728]">
                {QUESTIONS[currentQuestionIndex].text}
              </h3>

              <AnimatePresence mode="wait">
                {!showExplanation ? (
                  <motion.div 
                    key="actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col md:flex-row gap-8 justify-center items-center"
                  >
                    <button onClick={() => handleAnswer(true)} className="btn-truth w-full md:w-64">PRAVDA ✅</button>
                    <button onClick={() => handleAnswer(false)} className="btn-lie w-full md:w-64">LEŽ ❌</button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="explanation"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="mb-8">
                      {lastAnswerCorrect ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                          className="w-28 h-28 bg-[#6BCB77]/20 rounded-full flex items-center justify-center mx-auto border-4 border-[#6BCB77]"
                        >
                          <Smile size={70} className="text-[#6BCB77]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-28 h-28 bg-[#FF6B6B]/20 rounded-full flex items-center justify-center mx-auto border-4 border-[#FF6B6B]"
                        >
                          <Frown size={70} className="text-[#FF6B6B]" />
                        </motion.div>
                      )}
                    </div>
                    <h4 className={`text-5xl font-display font-bold mb-6 ${lastAnswerCorrect ? 'text-[#6BCB77]' : 'text-[#FF6B6B]'}`}>
                      {lastAnswerCorrect ? 'VÝBORNE!' : 'NEVADÍ!'}
                    </h4>
                    <p className="text-2xl text-[#7A6352] mb-12 font-medium leading-relaxed">
                      {QUESTIONS[currentQuestionIndex].explanation}
                    </p>
                    <button onClick={nextQuestion} className="btn-next w-full max-w-sm">
                      {currentQuestionIndex < QUESTIONS.length - 1 ? 'ĎALŠIA HÁDANKA' : 'POZRIEŤ VÝSLEDOK'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full z-10 text-center"
          >
            <div className="kid-card">
              <motion.div 
                animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-10 inline-block"
              >
                <Trophy size={120} className="text-[#FFD93D]" fill="currentColor" />
              </motion.div>
              
              <h2 className="text-6xl font-display font-bold mb-6 text-[#4A3728]">SI ŠIKOVNÍK! 🏆</h2>
              <p className="text-2xl text-[#7A6352] mb-10 font-medium">
                <span className="text-[#4D96FF] font-black">DETI</span>, Ryška je na vás hrdá! <br/>
                Spolu ste to zvládli na jednotku. 🦊❤️
              </p>
              
              <div className="bg-[#FFF9F0] rounded-[30px] p-10 mb-12 border-4 border-[#FFD93D]">
                <p className="text-xl uppercase tracking-widest text-[#7A6352] mb-4 font-bold">Vaše body</p>
                <p className="text-9xl font-display font-bold text-[#4A3728]">{score} / {QUESTIONS.length}</p>
              </div>

              <button onClick={restart} className="btn-truth w-full flex items-center justify-center gap-4">
                <RefreshCcw size={32} /> HRAŤ ZNOVA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Control */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-8 right-8 p-5 bg-white rounded-full shadow-xl border-4 border-[#FFD93D] text-[#4A3728] z-50"
      >
        {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
      </motion.button>
    </div>
  );
}
