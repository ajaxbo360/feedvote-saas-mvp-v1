import { MessageSquare, ThumbsUp, Award, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const cards = [
  {
    title: 'Feedback Items',
    icon: <MessageSquare className={'text-[#4B4F4F]'} size={18} />,
    value: '48',
    change: '+12 this week',
  },
  {
    title: 'Total Upvotes',
    icon: <ThumbsUp className={'text-[#4B4F4F]'} size={18} />,
    value: '286',
    change: '+24% from last month',
  },
  {
    title: 'Testimonials',
    icon: <Star className={'text-[#4B4F4F]'} size={18} />,
    value: '16',
    change: '+3 this month',
  },
  {
    title: 'Badges Earned',
    icon: <Award className={'text-[#4B4F4F]'} size={18} />,
    value: '5',
    change: '2 more to unlock',
  },
];
export function DashboardUsageCardGroup() {
  return (
    <div className={'grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2'}>
      {cards.map((card) => (
        <Card key={card.title} className={'bg-background/50 backdrop-blur-[24px] border-border p-6'}>
          <CardHeader className="p-0 space-y-0">
            <CardTitle className="flex justify-between items-center mb-6">
              <span className={'text-base leading-4'}>{card.title}</span> {card.icon}
            </CardTitle>
            <CardDescription className={'text-[32px] leading-[32px] text-primary'}>{card.value}</CardDescription>
          </CardHeader>
          <CardContent className={'p-0'}>
            <div className="text-sm leading-[14px] pt-2 text-secondary">{card.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
