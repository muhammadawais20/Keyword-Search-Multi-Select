import Image from "next/image";

export default function Card({ name, description }) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg h-full">
        <Image
          src="/gift.png"
          alt=""
          className="rounded-t-lg"
          height={400}
          width={400}
          priority
        />
        <div className="p-6">
          <h2 className="font-bold mb-2 text-2xl text-purple-800">{name}</h2>
          <p
            className="text-purple-700 mb-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
}
