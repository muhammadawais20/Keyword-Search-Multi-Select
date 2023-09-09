import Image from "next/image";

export default function Card({ name, description }) {
  return (
    <div class="w-full">
      <div class="bg-white rounded-lg shadow-lg h-full">
        <Image
          src="/gift.png"
          alt=""
          class="rounded-t-lg"
          height={400}
          width={400}
          priority
        />
        <div class="p-6">
          <h2 class="font-bold mb-2 text-2xl text-purple-800">{name}</h2>
          <p
            class="text-purple-700 mb-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
}
