declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react"

  export interface LucideProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = ComponentType<LucideProps>

  // Common icons used in the project
  export const Calendar: LucideIcon
  export const Users: LucideIcon
  export const CreditCard: LucideIcon
  export const Settings: LucideIcon
  export const Home: LucideIcon
  export const User: LucideIcon
  export const LogOut: LucideIcon
  export const Plus: LucideIcon
  export const Search: LucideIcon
  export const Filter: LucideIcon
  export const Edit: LucideIcon
  export const Trash2: LucideIcon
  export const Phone: LucideIcon
  export const Mail: LucideIcon
  export const MapPin: LucideIcon
  export const Clock: LucideIcon
  export const DollarSign: LucideIcon
  export const TrendingUp: LucideIcon
  export const TrendingDown: LucideIcon
  export const BarChart3: LucideIcon
  export const PieChart: LucideIcon
  export const Download: LucideIcon
  export const Upload: LucideIcon
  export const CheckCircle: LucideIcon
  export const XCircle: LucideIcon
  export const AlertCircle: LucideIcon
  export const Info: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronUp: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const MoreVertical: LucideIcon
  export const X: LucideIcon
  export const Menu: LucideIcon
  export const Star: LucideIcon
  export const Heart: LucideIcon
  export const Bookmark: LucideIcon
  export const Share: LucideIcon
  export const Copy: LucideIcon
  export const ExternalLink: LucideIcon
  export const Loader2: LucideIcon
  export const Refresh: LucideIcon
  export const Save: LucideIcon
  export const FileText: LucideIcon
  export const Image: LucideIcon
  export const Video: LucideIcon
  export const Music: LucideIcon
  export const Folder: LucideIcon
  export const FolderOpen: LucideIcon
  export const Archive: LucideIcon
  export const Trash: LucideIcon
  export const Lock: LucideIcon
  export const Unlock: LucideIcon
  export const Shield: LucideIcon
  export const Key: LucideIcon
  export const UserPlus: LucideIcon
  export const UserMinus: LucideIcon
  export const UserCheck: LucideIcon
  export const UserX: LucideIcon
  export const Bell: LucideIcon
  export const BellOff: LucideIcon
  export const MessageSquare: LucideIcon
  export const MessageCircle: LucideIcon
  export const Send: LucideIcon
  export const Paperclip: LucideIcon
  export const Smile: LucideIcon
  export const Frown: LucideIcon
  export const Meh: LucideIcon
  export const ThumbsUp: LucideIcon
  export const ThumbsDown: LucideIcon
  export const Flag: LucideIcon
  export const Tag: LucideIcon
  export const Tags: LucideIcon
  export const BookmarkPlus: LucideIcon
  export const BookmarkMinus: LucideIcon
  export const BookmarkCheck: LucideIcon
  export const BookmarkX: LucideIcon
  export const Leaf: LucideIcon
  export const ArrowRight: LucideIcon
  export const Euro: LucideIcon
  export const Banknote: LucideIcon
  export const Minus: LucideIcon
  export const Receipt: LucideIcon
  export const ShoppingCart: LucideIcon
  export const Check: LucideIcon
  export const ArrowLeft: LucideIcon
  export const Zap: LucideIcon
  export const Scissors: LucideIcon

  // Export all icons as default
  const lucideReact: {
    [key: string]: LucideIcon
  }

  export default lucideReact
}
