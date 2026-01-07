"use client";
import Image from "next/image";

interface UserInfoProps {
  name: string;
  email: string;
  avatar: string;
}

export default function UserInfo({ name, email, avatar }: UserInfoProps) {
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <Image 
              src={avatar} 
              alt={name} 
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">熵</span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>
    </div>
  );
}

