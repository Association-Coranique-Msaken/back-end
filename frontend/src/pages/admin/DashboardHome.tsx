import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {trend && (
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: 'primary.light',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = useState({
    users: 0,
    teachers: 0,
    groups: 0,
    competitions: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual statistics from API
    setStats({
      users: 145,
      teachers: 12,
      groups: 8,
      competitions: 3,
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom dir="rtl" sx={{ mb: 3 }}>
        نظرة عامة
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
        <StatCard
          title="التلاميذ"
          value={stats.users}
          icon={<PeopleRoundedIcon color="primary" />}
          trend="+12% من الشهر الماضي"
        />
        <StatCard
          title="المؤدبين"
          value={stats.teachers}
          icon={<SchoolRoundedIcon color="primary" />}
          trend="+2 هذا الشهر"
        />
        <StatCard
          title="المجموعات"
          value={stats.groups}
          icon={<GroupsRoundedIcon color="primary" />}
        />
        <StatCard
          title="المسابقات"
          value={stats.competitions}
          icon={<EmojiEventsRoundedIcon color="primary" />}
          trend="مسابقة واحدة نشطة"
        />
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom dir="rtl">
            مرحبا بك في لوحة التحكم
          </Typography>
          <Typography variant="body2" color="text.secondary" dir="rtl">
            من هنا يمكنك إدارة جميع جوانب الجمعية القرآنية. استخدم القائمة الجانبية للوصول إلى الميزات المختلفة.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
