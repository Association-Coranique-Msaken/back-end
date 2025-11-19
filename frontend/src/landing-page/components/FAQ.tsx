import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(
        isExpanded
          ? [...expanded, panel]
          : expanded.filter((item) => item !== panel),
      );
    };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'right', md: 'center' },
        }}
        dir="rtl"
      >
        الأسئلة الشائعة
      </Typography>
      <Box sx={{ width: '100%' }} dir="rtl">
        <Accordion
          expanded={expanded.includes('panel1')}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="span" variant="subtitle2">
              كيف يمكنني تسجيل الدخول إلى منصة الجمعية؟
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              يمكنك تسجيل الدخول من خلال اختيار نوع الحساب الخاص بك (إدارة، مؤدب، أو تلميذ) ثم إدخال بيانات الدخول الخاصة بك. إذا واجهت أي مشكلة، يرجى التواصل مع فريق الدعم عبر البريد الإلكتروني&nbsp;
              <Link href="mailto:support@aqm.org">support@aqm.org</Link>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel2')}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="span" variant="subtitle2">
              ما هو الغرض من منصة الجمعية القرآنية؟
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              منصة الجمعية القرآنية بمساكن توفر بيئة تعليمية متكاملة لتعليم وتحفيظ القرآن الكريم. تسمح المنصة للمديرين والمؤدبين والتلاميذ بالتفاعل والاستفادة من الخدمات التعليمية المختلفة.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel3')}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="span" variant="subtitle2">
              كيف يمكنني تحديث بيانات حسابي الشخصية؟
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              يمكنك تحديث بيانات حسابك الشخصية من خلال الدخول إلى الملف الشخصي في لوحة التحكم. اختر "تعديل البيانات الشخصية" وقم بتحديث المعلومات المطلوبة ثم احفظ التغييرات.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel4')}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="span" variant="subtitle2">
              كيف يمكنني التواصل مع فريق الدعم الفني؟
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              يمكنك التواصل مع فريق الدعم الفني من خلال البريد الإلكتروني على العنوان support@aqm.org أو من خلال نموذج التواصل المتاح في صفحة التواصل بنا. سنقوم بالرد على جميع الاستفسارات في أسرع وقت ممكن.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
