import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search,
  PlusCircle, 
  BookOpen, 
  ChevronRight,
  Calendar,
  Tag
} from 'lucide-react';
import { EmptyNotesState } from '@/components/dashboard/EmptyStates';

export function NotesSection({ limit = 4 }) {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch user notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['/api/notes', searchQuery],
    enabled: isAuthenticated,
  });
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Filter notes by search query
  const filteredNotes = Array.isArray(notes) 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : [];
  
  // Slice notes to limit
  const displayedNotes = filteredNotes.slice(0, limit);
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-emerald-300">
          Your Notes
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes"
              className="bg-[#0f172a] border border-emerald-500/30 text-white pl-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
          </div>
          
          <Link href="/notes/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        // Loading skeleton
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 p-6">
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex">
                <div className="w-full">
                  <div className="h-6 bg-[#1e293b]/50 rounded mb-2 w-3/4 animate-pulse" />
                  <div className="h-4 bg-[#1e293b]/50 rounded mb-1 animate-pulse" />
                  <div className="h-4 bg-[#1e293b]/50 rounded mb-3 w-2/3 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-[#1e293b]/50 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-[#1e293b]/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : displayedNotes.length > 0 ? (
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 divide-y divide-[#1e293b]">
          {displayedNotes.map((note: any) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <div className="p-6 hover:bg-[#1e293b]/20 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-orbitron text-lg text-white mb-2">{note.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-3">{note.content}</p>
                    
                    <div className="flex flex-wrap gap-2 items-center text-xs">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(note.createdAt)}
                      </div>
                      
                      {note.relatedTo && (
                        <div className="flex items-center text-gray-400">
                          <BookOpen className="h-3.5 w-3.5 mr-1" />
                          {note.relatedTo}
                        </div>
                      )}
                      
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center text-gray-400">
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          {note.tags.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            </Link>
          ))}
          
          {filteredNotes.length > limit && (
            <div className="p-4 text-center">
              <Link href="/notes">
                <Button 
                  variant="outline" 
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                >
                  View All Notes
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </Card>
      ) : (
        <EmptyNotesState />
      )}
    </section>
  );
}