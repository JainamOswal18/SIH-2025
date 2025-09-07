'use client';

import type { Tourist } from '@/lib/types';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function TourismDashboardFeatures({ tourists }: { tourists: Tourist[] }) {
    
    const nationalityDistribution = useMemo(() => {
        const counts = tourists.reduce((acc, tourist) => {
            acc[tourist.nationality] = (acc[tourist.nationality] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [tourists]);

    const riskLevelDistribution = useMemo(() => {
        const counts = tourists.reduce((acc, tourist) => {
            acc[tourist.riskLevel] = (acc[tourist.riskLevel] || 0) + 1;
            return acc;
        }, { Low: 0, Medium: 0, High: 0 } as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [tourists]);

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Tourism Analytics</CardTitle>
                <CardDescription>Insights on crowd management and visitor demographics.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="h-64">
                    <h4 className="text-sm font-semibold mb-2 text-center">Tourist Nationalities</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={nationalityDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {nationalityDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-64">
                    <h4 className="text-sm font-semibold mb-2 text-center">Tourist Risk Levels</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskLevelDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                            <Tooltip
                                cursor={{fill: 'hsl(var(--muted))'}}
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Bar dataKey="value" name="Tourists" radius={[4, 4, 0, 0]}>
                                {
                                    riskLevelDistribution.map((entry, index) => {
                                        const color = entry.name === 'High' ? 'hsl(var(--destructive))' : entry.name === 'Medium' ? 'hsl(var(--primary))' : 'hsl(var(--accent))';
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
