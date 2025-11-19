import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
  
function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }} dir="rtl">
      {'حقوق الطبع © '}
      <Link color="text.secondary" href="#">
        الجمعية القرآنية بمساكن 
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
        dir="rtl"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            {/* <SitemarkIcon /> */}
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }} dir="rtl">
              اشترك في النشرة الإخبارية
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }} dir="rtl">
              اشترك للحصول على آخر الأخبار والتحديثات. بدون رسائل مزعجة!
            </Typography>
            <InputLabel htmlFor="email-newsletter" sx={{ textAlign: 'right' }}>البريد الإلكتروني</InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="أدخل بريدك الإلكتروني"
                placeholder="بريدك الإلكتروني"
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'أدخل بريدك الإلكتروني',
                  },
                }}
                sx={{ width: '250px' }}
                dir="ltr"
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                اشترك
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            الخدمات
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            التسجيل
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            الأسئلة الشائعة
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            المزايا
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            الدعم
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            عن الجمعية
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            من نحن
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            رؤيتنا ورسالتنا
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            الفريق
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            قانوني
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            الشروط والأحكام
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            سياسة الخصوصية
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            تواصل معنا
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
        dir="rtl"
      >
        <div>
          <Link color="text.secondary" variant="body2" href="#">
            سياسة الخصوصية
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            شروط الخدمة
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://github.com"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://x.com"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
