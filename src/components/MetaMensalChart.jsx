import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LabelList, Cell,
} from 'recharts';

export default function MetaMensalChart({ data }) {
  const colors = ['#5B8FF9','#5AD8A6','#5D7092',
                  '#F6BD16','#E8684A','#6DC8EC'];

  return (
    <div style={{ width:'100%', height:300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top:20,right:20,left:0,bottom:40 }}>
          <XAxis dataKey="nome" interval={0} angle={-10} dy={10} />
          <YAxis hide />
          <Tooltip formatter={(v)=>`${v}%`} />

          <Bar dataKey="pct">
            {data.map((_,i)=><Cell key={i} fill={colors[i%colors.length]} />)}
            <LabelList dataKey="pct" position="top" formatter={(v)=>`${v}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}