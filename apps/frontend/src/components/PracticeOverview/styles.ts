import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

export const MetricCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const MetricIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.color}15;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const MetricValue = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
`;

export const MetricLabel = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin: 0;
`;

export const MetricTrend = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? '#22c55e' : '#ef4444'};
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ChartSection = styled.section`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ChartTitle = styled.h3`
  font-size: 1.125rem;
  color: #1a1a1a;
  margin: 0;
`;

export const ChartControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;
