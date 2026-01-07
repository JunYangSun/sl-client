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
        <div className="w-16 h-16 rounded-full from-primary to-primary/80 flex items-center justify-center overflow-hidden bg-[#B8860B]">
          {avatar ? (
            <Image 
              src={avatar} 
              alt={name} 
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-blue-500 text-xl font-bold">熵</span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
    </div>
  );
}

