import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useProfile } from "../hooks/useProfile";
import { Alert } from "../components";
import useAlert from "../hooks/useAlert";
import { uploadIcon } from "./uploadIcon";

const fields: { key: "name" | "tagline" | "bio" | "info_stage_2" | "info_stage_3" | "info_stage_4"; label: string; multiline?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "tagline", label: "Tagline (hero, stage 1)" },
  { key: "bio", label: "Bio paragraph (About page)", multiline: true },
  { key: "info_stage_2", label: "Info blurb — stage 2", multiline: true },
  { key: "info_stage_3", label: "Info blurb — stage 3", multiline: true },
  { key: "info_stage_4", label: "Info blurb — stage 4", multiline: true },
];

function ProfileAdmin() {
  const { profile, loading } = useProfile();
  const [form, setForm] = useState<Record<string, string>>({});
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert } = useAlert(3000);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        tagline: profile.tagline,
        bio: profile.bio,
        info_stage_2: profile.info_stage_2,
        info_stage_3: profile.info_stage_3,
        info_stage_4: profile.info_stage_4,
      });
      setResumeUrl(profile.resume_url);
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string | null> = { ...form, resume_url: resumeUrl };

      if (resumeFile) {
        payload.resume_url = await uploadIcon("profile-resume", resumeFile);
      }

      const { error } = await supabase.from("profile").upsert({ id: 1, ...payload });
      if (error) throw error;
      setResumeUrl(payload.resume_url);
      setResumeFile(null);
      showAlert({ text: "Saved", type: "success" });
    } catch (err) {
      showAlert({
        text: err instanceof Error ? err.message : "Save failed",
        type: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl relative">
      {alert.show && <Alert {...alert} />}

      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <label key={field.key} className="flex flex-col gap-1 text-sm font-medium">
            {field.label}
            {field.multiline ? (
              <textarea
                className="textarea"
                rows={3}
                value={form[field.key] ?? ""}
                onChange={(event) =>
                  setForm({ ...form, [field.key]: event.target.value })
                }
              />
            ) : (
              <input
                type="text"
                className="input"
                value={form[field.key] ?? ""}
                onChange={(event) =>
                  setForm({ ...form, [field.key]: event.target.value })
                }
              />
            )}
          </label>
        ))}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Resume (PDF)
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline w-fit"
            >
              Current resume
            </a>
          )}
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <button type="button" className="btn w-fit" disabled={saving} onClick={save}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default ProfileAdmin;
