import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
};

export default function SQLEditor({ value, onChange, onRun }: Props) {
  function handleMount(editor: any, monaco: any) {
    // Run with Ctrl/Cmd + Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun);
    // Focus so typing works immediately
    setTimeout(() => editor.focus(), 0);
  }

  return (
    <Editor
      height="100%"                 // <-- fills the flex container
      defaultLanguage="sql"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      options={{
        automaticLayout: true,      // <-- react to container size changes
        minimap: { enabled: false },
        wordWrap: "on",
        fontSize: 14,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
}
