import React from 'react';
import { IconType } from 'react-icons';
import { FiDollarSign, FiUsers, FiClock, FiClipboard } from 'react-icons/fi';
import { BsGraphUp, BsCalendarCheck, BsStar, BsSpeedometer } from 'react-icons/bs';
import {
  Container,
  Header,
  Title,
  Actions,
  MetricCard,
  MetricIcon,
  MetricValue,
  MetricLabel,
  MetricTrend,
  ChartSection,
  ChartCard,
  ChartHeader,
  ChartTitle,
  ChartControls
} from './styles';
import { Button } from '../common/Button';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface MetricProps {
  icon: IconType;
  value: number;
  label: string;
  trend: number;
  color: string;
  format?: (value: number) => string;
}

const Metric: React.FC<MetricProps> = ({ icon: Icon, value, label, trend, color, format = formatNumber }) => (
  <MetricCard>
    <MetricIcon color={color}>
      <Icon size={20} />
    </MetricIcon>
    <MetricValue>{format(value)}</MetricValue>
    <MetricLabel>{label}</MetricLabel>
    <MetricTrend isPositive={trend >= 0}>
      {trend >= 0 ? '+' : ''}{trend}%
      <BsGraphUp size={14} />
    </MetricTrend>
  </MetricCard>
);

interface PracticeOverviewProps {
  monthlyRevenue: number;
  patientGrowth: number;
  treatmentAcceptance: number;
  appointmentFillRate: number;
  insuranceClaims: number;
  averageWaitTime: number;
  patientSatisfaction: number;
  staffProductivity: number;
}

export const PracticeOverview: React.FC<PracticeOverviewProps> = ({
  monthlyRevenue,
  patientGrowth,
  treatmentAcceptance,
  appointmentFillRate,
  insuranceClaims,
  averageWaitTime,
  patientSatisfaction,
  staffProductivity,
}) => {
  const metrics = [
    {
      icon: FiDollarSign,
      value: monthlyRevenue,
      label: 'Monthly Revenue',
      trend: 8,
      color: '#3b82f6',
      format: formatCurrency,
    },
    {
      icon: FiUsers,
      value: patientGrowth,
      label: 'Patient Growth',
      trend: 12,
      color: '#8b5cf6',
    },
    {
      icon: FiClipboard,
      value: treatmentAcceptance,
      label: 'Treatment Acceptance',
      trend: 5,
      color: '#f59e0b',
      format: formatPercent,
    },
    {
      icon: BsCalendarCheck,
      value: appointmentFillRate,
      label: 'Appointment Fill Rate',
      trend: 3,
      color: '#10b981',
      format: formatPercent,
    },
    {
      icon: FiClipboard,
      value: insuranceClaims,
      label: 'Insurance Claims',
      trend: 7,
      color: '#3b82f6',
    },
    {
      icon: FiClock,
      value: averageWaitTime,
      label: 'Average Wait Time',
      trend: -4,
      color: '#8b5cf6',
      format: (value) => `${value}min`,
    },
    {
      icon: BsStar,
      value: patientSatisfaction,
      label: 'Patient Satisfaction',
      trend: 2,
      color: '#f59e0b',
      format: (value) => value.toFixed(1),
    },
    {
      icon: BsSpeedometer,
      value: staffProductivity,
      label: 'Staff Productivity',
      trend: 6,
      color: '#10b981',
      format: formatPercent,
    },
  ];

  return (
    <>
      <Header>
        <Title>Practice Overview</Title>
        <Actions>
          <Button variant="secondary" onClick={() => {}}>Generate Report</Button>
          <Button variant="secondary" onClick={() => {}}>AI Insights</Button>
          <Button variant="primary" onClick={() => {}}>Add Staff</Button>
        </Actions>
      </Header>

      <Container>
        {metrics.map((metric, index) => (
          <Metric key={index} {...metric} />
        ))}
      </Container>

      <ChartSection>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Revenue Analytics</ChartTitle>
            <ChartControls>
              <Button variant="ghost" size="small" onClick={() => {}}>Export</Button>
              <Button variant="ghost" size="small" onClick={() => {}}>Filter</Button>
            </ChartControls>
          </ChartHeader>
          {/* Revenue chart component will go here */}
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Staff Performance</ChartTitle>
            <Button variant="ghost" size="small" onClick={() => {}}>View All</Button>
          </ChartHeader>
          {/* Staff performance component will go here */}
        </ChartCard>
      </ChartSection>
    </>
  );
};
