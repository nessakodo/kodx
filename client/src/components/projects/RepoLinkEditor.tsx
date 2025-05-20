import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { useToast } from "@/hooks/use-toast";
import { Github, CheckCircle, Edit, ExternalLink, Save, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface RepoLinkEditorProps {
  projectId: number;
  initialRepoUrl?: string;
  className?: string;
}

export function RepoLinkEditor({
  projectId,
  initialRepoUrl = "",
  className = "",
}: RepoLinkEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [tempRepoUrl, setTempRepoUrl] = useState(initialRepoUrl);
  const [isValid, setIsValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setRepoUrl(initialRepoUrl);
    setTempRepoUrl(initialRepoUrl);
  }, [initialRepoUrl]);

  const validateGithubUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid
    const githubRegex = /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+\/?$/;
    return githubRegex.test(url);
  };

  const handleSave = async () => {
    if (!validateGithubUrl(tempRepoUrl)) {
      setIsValid(false);
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL or leave it empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // In a real app, this would be an API call
      // await apiRequest(`/api/projects/${projectId}/repo-url`, {
      //   method: "PATCH",
      //   body: JSON.stringify({ repoUrl: tempRepoUrl }),
      // });

      // For the mock version, simulate successful saving
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setRepoUrl(tempRepoUrl);
      setIsEditing(false);
      setIsValid(true);
      
      toast({
        title: "Repository linked",
        description: "Your GitHub repository URL has been saved.",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was an error saving your repository URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempRepoUrl(repoUrl);
    setIsEditing(false);
    setIsValid(true);
  };

  return (
    <GlassmorphicCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-orbitron text-sm text-gray-300 flex items-center">
          <Github className="h-4 w-4 mr-2" />
          GitHub Repository
        </h3>
        
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-[#9ecfff] hover:text-white"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Input
              value={tempRepoUrl}
              onChange={(e) => {
                setTempRepoUrl(e.target.value);
                setIsValid(validateGithubUrl(e.target.value));
              }}
              placeholder="https://github.com/username/repository"
              className={`bg-[#1e293b]/70 text-sm ${
                !isValid ? "border-red-500" : "border-[#1e293b]"
              }`}
            />
            {!isValid && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid GitHub repository URL
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={handleCancel}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-[#1e293b]/70 border-[#9ecfff]/30"
              onClick={handleSave}
              disabled={!isValid || isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving
                </span>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {repoUrl ? (
            <div className="flex items-center">
              <div className="flex-1 overflow-hidden">
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ecfff] hover:underline text-sm flex items-center"
                >
                  {repoUrl}
                  <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                </a>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No repository linked. Add a GitHub URL to track your project.
            </p>
          )}
        </div>
      )}
    </GlassmorphicCard>
  );
}