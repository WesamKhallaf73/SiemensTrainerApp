import React, { useRef, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';

interface EditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    diagnostics: any[];
}

export const AWLEditor: React.FC<EditorProps> = ({ value, onChange, diagnostics }) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Register simple AWL language
        monaco.languages.register({ id: 'awl' });
        monaco.languages.setMonarchTokensProvider('awl', {
            tokenizer: {
                root: [
                    [/(U|UN|O|ON|X|XN|=|S|R)\s+[A-Z0-9.]+/, 'keyword'],
                    [/(L|T)\s+[A-Z0-9.]+/, 'keyword'],
                    [/(CALL|CC|UC)\s+[A-Z0-9]+/, 'keyword'],
                    [/(nop)\s+\d+/, 'comment'],
                    [/\/\/.*/, 'comment'],
                    [/OB|FB|FC|DB/, 'type'],
                    [/\d+/, 'number'],
                ]
            }
        });

        monaco.editor.setTheme('vs-light'); // or define custom theme
    };

    useEffect(() => {
        if (monacoRef.current && editorRef.current) {
            const markers = diagnostics.map(d => ({
                startLineNumber: d.line,
                startColumn: 1,
                endLineNumber: d.line,
                endColumn: 1000,
                message: d.message,
                severity: d.severity === 'error' ? 8 : 4, // 8=Error, 4=Warning
            }));
            monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), 'owner', markers);
        }
    }, [diagnostics]);

    return (
        <Editor
            height="100%"
            defaultLanguage="awl"
            value={value}
            onChange={onChange}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    );
};
