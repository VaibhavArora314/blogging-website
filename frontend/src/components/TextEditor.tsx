import { useRef } from "react";

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
                className="outline-none block w-full px-0 text-lg lg:text-xl text-gray-800 border-0 overflow-hidden resize-none"
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
  