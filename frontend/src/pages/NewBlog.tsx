// import { Appbar } from "../components/Appbar"
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export const NewBlog = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const titleRef = useRef<HTMLTextAreaElement>(null);
  
    useEffect(() => {
      if (titleRef.current) {
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
      }
    }, [title]);
  
    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (titleRef.current) {
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
      }
      setTitle(e.target.value);
    };
  
    return (
      <div className="flex flex-col items-center justify-start w-full p-4 pt-8">
        <div className="container w-full">
          <div className="flex justify-center items-start gap-8">
            <textarea
              ref={titleRef}
              onChange={handleTitleChange}
              className="outline-none block w-full px-0 text-xl lg:text-2xl text-gray-800 border-0 pl-2 overflow-hidden resize-none"
              placeholder="Title"
            />
            <button
              onClick={async () => {
                console.log(title, description);
              }}
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            >
              Publish
            </button>
          </div>
  
          <TextEditor
            onChange={(desc) => {
              setDescription(desc);
            }}
          />
        </div>
      </div>
    );
  };

function TextEditor({ onChange }: { onChange: (desc: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onChange(e.target.value);
  };

  return (
    <div className="mt-2">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between">
          <div className="my-2 bg-white w-full">
            <textarea
              ref={textareaRef}
              onChange={handleChange}
              id="editor"
              rows={1}
              className="outline-none block w-full px-0 text-lg lg:text-xl text-gray-800 border-0 pl-2 overflow-hidden resize-none"
              placeholder="Write article here..."
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
