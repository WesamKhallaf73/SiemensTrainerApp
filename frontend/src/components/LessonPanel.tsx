import React from 'react';
import { BookOpen, CheckCircle, Play } from 'lucide-react';
import type { Lesson } from '../data/lessons';
// import clsx from 'clsx'; // Not used in this version

interface LessonPanelProps {
    lessons: Lesson[];
    activeLessonId: string | null;
    onSelectLesson: (id: string) => void;
    onLoadCode: (code: string) => void;
}

export const LessonPanel: React.FC<LessonPanelProps> = ({
    lessons, activeLessonId, onSelectLesson, onLoadCode
}) => {

    const activeLesson = lessons.find(l => l.id === activeLessonId);
    const [showSolution, setShowSolution] = React.useState(false);

    // Reset solution visibility when changing lessons
    React.useEffect(() => {
        setShowSolution(false);
    }, [activeLessonId]);

    // Simple Markdown Parser (Headers and Bold only)
    const renderMarkdown = (text: string) => {
        return text.split('\n').map((line, idx) => {
            let content = line;
            let className = "text-sm text-gray-700 mb-1";

            if (line.startsWith('### ')) {
                content = line.replace('### ', '');
                className = "text-lg font-bold text-siemens-teal mt-4 mb-2";
            } else if (line.startsWith('**') && line.endsWith('**')) {
                // Whole line bold
                content = line.replace(/^\*\*/, '').replace(/\*\*$/, '');
                className = "font-bold text-gray-900 mb-1";
            } else if (line.startsWith('- ')) {
                content = line; // list item
                className = "ml-4 text-sm text-gray-700 mb-1 list-disc";
            }

            // Inline bold parsing
            const parts = content.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={idx} className={className}>
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('`') && part.endsWith('`')) {
                            return <code key={i} className="bg-gray-100 px-1 rounded font-mono text-siemens-teal text-xs">{part.slice(1, -1)}</code>;
                        }
                        return part;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full bg-white border-r w-[25%] min-w-[350px] flex-shrink-0">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    <BookOpen size={18} className="text-siemens-teal" />
                    Training Lessons
                </h2>
                <div className="text-xs text-gray-500">{lessons.length} Lessons</div>
            </div>

            {/* Lesson List vs Detail View */}
            {!activeLesson ? (
                <div className="flex-1 overflow-auto divide-y">
                    {lessons.map(lesson => (
                        <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            className="w-full text-left p-4 hover:bg-teal-50 transition-colors group"
                        >
                            <div className="font-bold text-sm text-gray-800 group-hover:text-siemens-teal">
                                {lesson.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {lesson.objectives[0]}
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* Header Back Button */}
                    <button
                        onClick={() => onSelectLesson("")}
                        className="p-2 text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 border-b"
                    >
                        ← Back to List
                    </button>

                    <div className="flex-1 overflow-auto p-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-4">{activeLesson.title}</h1>

                        <div className="prose prose-sm max-w-none">
                            {renderMarkdown(activeLesson.description)}
                        </div>

                        <div className="mt-6 bg-yellow-50 p-3 rounded border border-yellow-200">
                            <h4 className="font-bold text-xs text-yellow-800 uppercase mb-2 flex items-center gap-1">
                                <CheckCircle size={12} /> Objectives
                            </h4>
                            <ul className="text-xs text-yellow-900 list-disc list-inside space-y-1">
                                {activeLesson.objectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t-2 bg-white sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        {/* Solution Overlay */}
                        {showSolution && activeLesson.solutionCode && (
                            <div className="bg-gray-800 text-gray-100 p-4 text-xs font-mono overflow-auto max-h-[40vh] border-b border-gray-700 shadow-inner">
                                <div className="flex justify-between items-center mb-2 text-gray-400 border-b border-gray-700 pb-1">
                                    <span>SUGGESTED SOLUTION:</span>
                                    <button onClick={() => setShowSolution(false)}>✖</button>
                                </div>
                                <pre>{activeLesson.solutionCode}</pre>
                            </div>
                        )}

                        {/* Footer Buttons */}
                        <div className="p-4 flex flex-col gap-2">
                            {activeLesson.solutionCode && (
                                <button
                                    onClick={() => setShowSolution(!showSolution)}
                                    className="w-full py-1 text-xs text-center text-siemens-teal font-medium hover:underline"
                                >
                                    {showSolution ? '▼ Hide Solution' : '▶ Show Solution'}
                                </button>
                            )}

                            <button
                                onClick={() => onLoadCode(activeLesson.initialCode)}
                                className="w-full py-3 px-4 bg-orange-500 text-white rounded font-bold text-sm shadow hover:bg-orange-600 flex items-center justify-center gap-2"
                            >
                                <Play size={18} fill="currentColor" />
                                LOAD STARTER CODE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
