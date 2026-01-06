import styled from "styled-components";

export const Shell = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, Arial;
`;

export const TopBar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  font-size: 20px;
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export const Btn = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  background: #111;
  color: #fff;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const Label = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
`;

export const ErrorBox = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff4f4;
  border: 1px solid #ffd2d2;
  color: #9a1c1c;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Kpi = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 16px;
`;

export const KpiLabel = styled.div`
  font-size: 12px;
  opacity: 0.75;
  margin-bottom: 6px;
`;

export const KpiValue = styled.div`
  font-size: 26px;
  font-weight: 700;
`;

export const Subtitle = styled.h2`
  font-size: 16px;
  margin: 0 0 12px 0;
`;

export const Dist = styled.div`
  display: grid;
  gap: 8px;
`;

export const DistRow = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr 32px;
  gap: 10px;
  align-items: center;
`;

export const DistScore = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

export const DistBar = styled.div`
  height: 10px;
  border-radius: 999px;
  background: #111;
  min-width: 2px;
`;

export const DistCount = styled.div`
  font-size: 12px;
  opacity: 0.8;
  text-align: right;
`;

export const Hint = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border-bottom: 1px solid #eee;
    padding: 10px 8px;
    text-align: left;
    vertical-align: top;
    font-size: 13px;
  }

  th {
    font-size: 12px;
    opacity: 0.75;
  }
`;
