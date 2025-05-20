import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GithubIcon, LinkIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepoLinkEditorProps {
  projectId: number;
  initialRepoUrl?: string;
  onSaveSuccess?: () => void;
}

export function RepoLinkEditor({ projectId, initialRepoUrl, onSaveSuccess }: RepoLinkEditorProps) {
  const [isEditing, setIsEditing] = useState(!initialRepoUrl);
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl || "");
  const [savedUrl, setSavedUrl] = useState(initialRepoUrl || "");
  const { toast } = useToast();

  // Save to localStorage to persist between sessions
  useEffect(() => {
    const savedRepos = localStorage.getItem("userProjectRepos");
    if (savedRepos) {
      const reposObj = JSON.parse(savedRepos);
      if (reposObj[projectId] && !initialRepoUrl) {
        setRepoUrl(reposObj[projectId]);
        setSavedUrl(reposObj[projectId]);
        setIsEditing(false);
      }
    }
  }, [projectId, initialRepoUrl]);

  const handleSave = () => {
    if (!repoUrl) {
      toast({
        title: "Repository URL Required",
        description: "Please enter a valid repository URL",
        variant: "destructive"
      });
      return;
    }

    // Simple URL validation
    if (!repoUrl.startsWith("http://") && !repoUrl.startsWith("https://")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    try {
      const savedRepos = localStorage.getItem("userProjectRepos");
      const reposObj = savedRepos ? JSON.parse(savedRepos) : {};
      reposObj[projectId] = repoUrl;
      localStorage.setItem("userProjectRepos", JSON.stringify(reposObj));
      
      setSavedUrl(repoUrl);
      setIsEditing(false);
      
      toast({
        title: "Repository Link Saved",
        description: "Your repository has been linked to this project",
        variant: "default"
      });
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      toast({
        title: "Error Saving Repository",
        description: "There was an error saving your repository link",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setRepoUrl(savedUrl);
    setIsEditing(false);
  };

  const handleRemove = () => {
    try {
      const savedRepos = localStorage.getItem("userProjectRepos");
      if (savedRepos) {
        const reposObj = JSON.parse(savedRepos);
        delete reposObj[projectId];
        localStorage.setItem("userProjectRepos", JSON.stringify(reposObj));
      }
      
      setRepoUrl("");
      setSavedUrl("");
      setIsEditing(true);
      
      toast({
        title: "Repository Link Removed",
        description: "Your repository link has been removed",
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "There was an error removing your repository link",
        variant: "destructive"
      });
    }
  };

  if (isEditing) {
    return (
      <div className="mt-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-300">Link Your Repository</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <GithubIcon className="h-4 w-4" />
            </div>
            <Input
              placeholder="https://github.com/yourusername/yourrepo"
              className="pl-9 bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="btn-kodex hover-glow"
              size="sm"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Save
            </Button>
            {savedUrl && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="btn-kodex"
                size="sm"
              >
                <XIcon className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">Link your GitHub repository to easily continue your progress</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Your Repository</h3>
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-gray-400 hover:text-gray-200"
        >
          <PencilIcon className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      </div>
      <div className="flex items-center justify-between p-3 rounded-md bg-[#1e293b]/30 border border-[#1e293b]">
        <div className="flex items-center gap-2 overflow-hidden">
          <GithubIcon className="h-4 w-4 shrink-0 text-[#9ecfff]" />
          <span className="text-sm text-gray-300 truncate">{savedUrl}</span>
        </div>
        <div className="flex gap-1">
          <a
            href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-[#1e293b]/80 text-gray-400 hover:text-[#9ecfff] transition-colors"
            title="Open repository"
          >
            <LinkIcon className="h-4 w-4" />
          </a>
          <Button
            onClick={handleRemove}
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto rounded-md hover:bg-[#1e293b]/80 text-gray-400 hover:text-red-400 transition-colors"
            title="Remove link"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}