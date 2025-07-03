import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile & { last_username_change?: string } | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [emailEditing, setEmailEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  // Helper: can change username?
  const canChangeUsername = (() => {
    if (!profile) return false;
    const last = profile.last_username_change || profile.created_at;
    if (!last) return true;
    const lastChange = new Date(last);
    const now = new Date();
    const diff = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 7;
  })();

  // Username change handler
  const handleUsernameChange = async () => {
    setUsernameError('');
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }
    setUpdatingUsername(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername, last_username_change: new Date().toISOString() })
      .eq('id', user!.id);
    setUpdatingUsername(false);
    if (error) {
      setUsernameError('Failed to update username');
    } else {
      setEditingUsername(false);
      setProfile({ ...profile!, username: newUsername, last_username_change: new Date().toISOString() });
    }
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError('');
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user!.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setAvatarError('Failed to upload avatar');
      setAvatarUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user!.id);
    setAvatarUploading(false);
    if (updateError) {
      setAvatarError('Failed to update avatar');
    } else {
      setProfile({ ...profile!, avatar_url: publicUrl });
    }
  };

  // Email change handler
  const handleEmailChange = async () => {
    setEmailError('');
    if (!newEmail.trim()) {
      setEmailError('Email cannot be empty');
      return;
    }
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setEmailError('Failed to update email');
    } else {
      setEmailEditing(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async () => {
    setPasswordError('');
    if (!newPassword.trim()) {
      setPasswordError('Password cannot be empty');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError('Failed to update password');
    } else {
      setPasswordEditing(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="p-8 text-center bg-slate-800 rounded-lg">You must be signed in to view your profile.</div>
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="p-8 text-center bg-slate-800 rounded-lg">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-slate-800 rounded-lg text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
            <AvatarFallback>{profile.display_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            title="Change profile picture"
          >
            {avatarUploading ? '...' : '✏️'}
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
        {avatarError && <div className="text-red-400 mb-2">{avatarError}</div>}

        {/* Username */}
        <div className="mb-2">
          <span className="text-gray-400">Username: </span>
          {editingUsername ? (
            <>
              <input
                className="bg-slate-700 text-white rounded px-2 py-1"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                disabled={updatingUsername}
              />
              <button className="ml-2 text-blue-400" onClick={handleUsernameChange} disabled={updatingUsername}>Save</button>
              <button className="ml-2 text-gray-400" onClick={() => setEditingUsername(false)}>Cancel</button>
              {usernameError && <div className="text-red-400 mt-1">{usernameError}</div>}
            </>
          ) : (
            <>
              <span className="text-white font-bold">@{profile.username}</span>
              <button
                className="ml-2 text-blue-400 underline"
                onClick={() => { setEditingUsername(true); setNewUsername(profile.username); }}
                disabled={!canChangeUsername}
                title={canChangeUsername ? 'Change username' : 'You can only change your username every 7 days'}
              >
                Change
              </button>
            </>
          )}
        </div>

        {/* Email */}
        <div className="mb-2">
          <span className="text-gray-400">Email: </span>
          {emailEditing ? (
            <>
              <input
                className="bg-slate-700 text-white rounded px-2 py-1"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              <button className="ml-2 text-blue-400" onClick={handleEmailChange}>Save</button>
              <button className="ml-2 text-gray-400" onClick={() => setEmailEditing(false)}>Cancel</button>
              {emailError && <div className="text-red-400 mt-1">{emailError}</div>}
            </>
          ) : (
            <>
              <span className="text-white font-bold">•••••••••••••••</span>
              <button className="ml-2 text-blue-400 underline" onClick={() => { setEmailEditing(true); setNewEmail(user.email ?? ''); }}>Change</button>
            </>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <span className="text-gray-400">Password: </span>
          {passwordEditing ? (
            <>
              <input
                className="bg-slate-700 text-white rounded px-2 py-1"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button className="ml-2 text-blue-400" onClick={handlePasswordChange}>Save</button>
              <button className="ml-2 text-gray-400" onClick={() => setPasswordEditing(false)}>Cancel</button>
              {passwordError && <div className="text-red-400 mt-1">{passwordError}</div>}
            </>
          ) : (
            <>
              <span className="text-white font-bold">•••••••••••••••</span>
              <button className="ml-2 text-blue-400 underline" onClick={() => setPasswordEditing(true)}>Change</button>
            </>
          )}
        </div>

        {/* Display name and bio (optional) */}
        <h2 className="text-2xl font-bold text-white mb-2 mt-6">{profile.display_name}</h2>
        {profile.bio && <p className="text-gray-300 mt-4">{profile.bio}</p>}
      </div>
    </div>
  );
} 