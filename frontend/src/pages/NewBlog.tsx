import { useEffect, useRef, useState } from "react";

export const NewBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string>("");
  const [topic, setTopic] = useState("");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
    setTitle(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    console.log(title, description, bannerImage, topic);
    // Add your publish logic here, including uploading the image to your server or cloud storage
  };

  return (
    <div className="flex flex-col items-center justify-start w-full p-4 pt-8">
      <div className="container w-full">
        <div className="flex justify-between mb-2">
          <h2 className="font-medium text-lg lg:text-2xl">New Post</h2>
          <button
            onClick={handlePublish}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish
          </button>
        </div>
        <input
          onChange={handleTitleChange}
          className="outline-none block w-full px-0 text-xl lg:text-2xl text-gray-800 border-0 overflow-hidden resize-none mb-2"
          placeholder="Title"
        />
        <input
          type="text"
          onChange={(e) => setTopic(e.target.value)}
          className="outline-none block w-full py-2 text-lg lg:text-xl text-gray-800 border-0 rounded-md mb-2"
          placeholder="Topic"
        />
        <label
          htmlFor="banner"
          className="font-normal text-lg lg:text-xl text-gray-900"
        >
          Banner:{" "}
        </label>
        <input
          id="banner"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="outline-none block w-full py-2 text-lg lg:text-xl text-gray-800 border-0 rounded-md mb-2"
        />
        {bannerImagePreview && (
          // <div className="mt-4">
            <img
              src={bannerImagePreview}
              alt="Banner Preview"
              className="h-40 rounded-md"
            />
          // </div>
        )}

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
