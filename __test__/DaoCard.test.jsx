import { render, screen } from '@testing-library/react';
import DaoCard from '../src/components/DaoCard.tsx';

describe('DaoCard', () => {
  test('renders dao card with correct content', () => {
    const daoId = 'test-dao-id';
    const daoName = 'Test DAO';
    const owner = 'test-owner';
    const assetId = 123;
    const owned = true;
    render(
      <DaoCard
        daoId={daoId}
        daoName={daoName}
        owner={owner}
        assetId={assetId}
        owned={owned}
      />
    );

    const daoNameElement = screen.getByText(daoName);
    expect(daoNameElement).toBeInTheDocument();

    const daoIdElement = screen.getByText(`DAO ID: ${daoId}`);
    expect(daoIdElement).toBeInTheDocument();
  });
});
