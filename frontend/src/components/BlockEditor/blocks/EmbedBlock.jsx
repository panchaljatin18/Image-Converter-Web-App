import React, { useState } from "react";
import { Video, Link as LinkIcon } from "lucide-react";

export default function EmbedBlock({ attributes, onChange, isSelected }) {
  const { url = "", provider = "youtube", caption = "" } = attributes;
  const [inputUrl, setInputUrl] = useState(url);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      let detectedProvider = "youtube";
      if (inputUrl.includes("vimeo.com")) detectedProvider = "vimeo";
      else if (inputUrl.includes("<iframe")) detectedProvider = "iframe";
      onChange({ url: inputUrl.trim(), provider: detectedProvider });
    }
  };

  const getEmbedSrc = () => {
    if (!url) return "";
    if (provider === "youtube" && url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (provider === "youtube" && url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (provider === "vimeo" && !url.includes("player.vimeo.com")) {
      const vimeoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return url;
  };

  if (!url) {
    return (
      <form onSubmit={handleSubmit} className="my-4 p-6 bg-[#090914] border-2 border-dashed border-indigo-500/30 rounded-2xl flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <Video size={20} />
        </div>
        <h4 className="text-sm font-bold text-white font-['Outfit']">Embed Video</h4>
        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Paste YouTube or Vimeo URL..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-[#141424] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
          />
          <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer">
            Embed
          </button>
        </div>
      </form>
    );
  }

  return (
    <figure className="my-4 space-y-2">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <iframe src={getEmbedSrc()} className="w-full h-full border-0" allowFullScreen title="Embedded Video" />
      </div>
      <figcaption
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ caption: e.currentTarget.innerHTML })}
        className="text-xs text-gray-400 italic text-center outline-none empty:before:content-['Add_caption...'] empty:before:text-gray-600"
        dangerouslySetInnerHTML={{ __html: caption }}
      />
    </figure>
  );
}
