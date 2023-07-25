import { SERVICE_URL } from '@/config';
import type { Challenge } from '@/types/dao';

export interface Dao {
  id: string;
  name: string;
  creator_id: string;
  owner_id: string;
  asset_id: number;
  proposal_duration: number;
  proposal_token_deposit: number;
  minimum_majority_per_1024: number;
  setup_complete: boolean;
  metadata_url: string;
  metadata_hash: string;
  metadata: Metadata | null;
  number_of_token_holders: number | null;
  number_of_open_proposals: number | null;
  most_recent_proposals: string[] | null;
}

export interface Metadata {
  email: string;
  images: Images;
  description_long: string;
  description_short: string;
}

export interface Images {
  logo?: Logo;
}

export interface Logo {
  large: Image;
  small: Image;
  medium: Image;
  content_type: string | null;
}

export interface Image {
  url?: string;
}

const get = async (
  daoId: string
): Promise<
  Response & {
    data: Dao;
  }
> => {
  const response = await fetch(
    `${SERVICE_URL}/daos/${encodeURIComponent(daoId)}`
  );

  const objResponse = await response.json();

  return {
    ...response,
    data: objResponse,
  };
};

const getChallenge = async (
  daoId: string
): Promise<
  Response & {
    data: Challenge;
  }
> => {
  const response = await fetch(`${SERVICE_URL}/daos/${daoId}/challenge/`);
  const objResponse = await response.json();
  return {
    ...response,
    data: objResponse,
  };
};

const challenge = {
  get: getChallenge,
};

export const DaoService = {
  get,
  challenge,
};
