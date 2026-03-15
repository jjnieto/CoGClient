import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RarityBadge } from '../../components/equipment/RarityBadge';

describe('RarityBadge', () => {
  it('renders Common for rarity 0', () => {
    render(<RarityBadge rarity={0} />);
    expect(screen.getByText('Common')).toBeInTheDocument();
  });

  it('renders Rare for rarity 1', () => {
    render(<RarityBadge rarity={1} />);
    expect(screen.getByText('Rare')).toBeInTheDocument();
  });

  it('renders Epic for rarity 2', () => {
    render(<RarityBadge rarity={2} />);
    expect(screen.getByText('Epic')).toBeInTheDocument();
  });

  it('renders Legendary for rarity 3', () => {
    render(<RarityBadge rarity={3} />);
    expect(screen.getByText('Legendary')).toBeInTheDocument();
  });

  it('renders Mythic for rarity 4', () => {
    render(<RarityBadge rarity={4} />);
    expect(screen.getByText('Mythic')).toBeInTheDocument();
  });
});
