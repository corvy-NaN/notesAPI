import { useState } from "react";

type NoteFormProps = {
  initialData?: {
    title: string;
    content: string;
  };
  onSubmit: (data: {title: string; content: string }) => void;
};

const NoteForm = ({ initialData = {title: "", content:""}, onSubmit }:NoteFormProps) =>{
    const [title, setTitle] = useState(initialData.title || "");
    const [content, setContent] = useState(initialData.content || "");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!title.trim() || !content.trim()){
            setError("Todos los campos son Obligatorios");
            return;
        }

        setError("");
        onSubmit({title: title.trim(), content: content.trim() });
    };

    return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded shadow-md max-w-lg mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="border rounded p-2 w-full"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenido"
        className="border rounded p-2 w-full h-32"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  );
};

export default NoteForm;