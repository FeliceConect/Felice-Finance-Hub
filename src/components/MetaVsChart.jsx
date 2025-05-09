import {
  BarChart,Bar,XAxis,YAxis,Tooltip,Legend,
  ResponsiveContainer,LabelList
} from 'recharts';

export default function MetaVsChart({ data }) {
  const fmt = (v)=>`R$ ${Number(v).toLocaleString('pt-BR')}`;

  return (
    <div style={{ width:'100%', height:300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top:20,right:20,left:0,bottom:40 }}>
          <XAxis dataKey="nome" interval={0} angle={-10} dy={10} />
          <YAxis />
          <Tooltip formatter={(v)=>fmt(v)} />
          <Legend />
          <Bar dataKey="meta_bruta" name="Meta (R$)" fill="#b180ff">
            <LabelList dataKey="meta_bruta" position="top"
              formatter={(v)=>`R$${(v/1000).toFixed(0)}k`} />
          </Bar>
          <Bar dataKey="realizado_bruta" name="Realizado (R$)" fill="#5AD8A6">
            <LabelList dataKey="realizado_bruta" position="top"
              formatter={(v)=>`R$${(v/1000).toFixed(0)}k`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}