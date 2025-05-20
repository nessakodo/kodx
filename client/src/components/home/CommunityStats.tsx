import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { motion } from "framer-motion";
import { BookOpenIcon, UsersIcon, FolderIcon } from "lucide-react";

export function CommunityStats() {
  const stats = [
    {
      title: "Labs Completed",
      value: "216",
      icon: <BookOpenIcon className="h-5 w-5 text-[#6fcf97]" />,
      color: "from-[#6fcf97]/20 to-transparent",
      borderColor: "border-[#6fcf97]/30"
    },
    {
      title: "Active Members",
      value: "200+",
      icon: <UsersIcon className="h-5 w-5 text-[#56ccf2]" />,
      color: "from-[#56ccf2]/20 to-transparent",
      borderColor: "border-[#56ccf2]/30"
    },
    {
      title: "Projects Published",
      value: "78",
      icon: <FolderIcon className="h-5 w-5 text-[#bb86fc]" />,
      color: "from-[#bb86fc]/20 to-transparent",
      borderColor: "border-[#bb86fc]/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GlassmorphicCard className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-md bg-gradient-to-r ${stat.color} ${stat.borderColor} border`}>
                {stat.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-300">{stat.title}</h3>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-orbitron text-white">{stat.value}</span>
            </div>
          </GlassmorphicCard>
        </motion.div>
      ))}
    </div>
  );
}