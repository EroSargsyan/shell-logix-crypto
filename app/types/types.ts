export interface IWatchlistItem {
  id: string;
  icon: any;
  name: string;
  coinCount: number;
  coins: ICoin[];
}

export interface ICoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO date string
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO date string
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string; // ISO date string
}

export interface ICoinsState {
  items: ICoin[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface IWatchlistModalProps {
  visible: boolean;
  onClose: () => void;
  watchlists: IWatchlistItem[];
  selectedWatchlistId?: string;
  onSelectWatchlist: (id: string) => void;
  onCreateNew: () => void;
  onEditPress: () => void;
}

export interface IWatchlist {
  id: string;
  name: string;
  icon: string;
  coinCount: number;
  coins: ICoin[];
}

export interface IWatchlistsState {
  items: IWatchlist[];
  // selectedWatchlistId: string | null;
}

export interface ITempWatchlistState {
  icon: string;
  selectedCoins: ICoin[];
}
