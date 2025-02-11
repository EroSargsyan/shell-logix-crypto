export interface WatchlistItem {
  id: string;
  icon: any;
  name: string;
  coinCount: number;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export interface WatchlistModalProps {
  visible: boolean;
  onClose: () => void;
  watchlists: WatchlistItem[];
  selectedWatchlistId?: string;
  onSelectWatchlist: (id: string) => void;
  onCreateNew: () => void;
  onEditPress: () => void;
}
