import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-oniria_darkblue via-oniria_purple to-oniria_lightpink">
      <h1 className="text-4xl font-bold text-oniria_pink mb-4">Mi Perfil</h1>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md">
        <p className="text-lg text-oniria_lightpink mb-2">Bienvenido a tu perfil.</p>
      </div>
    </div>
  );
};

export default Profile;