import  { useEffect, useState } from 'react';
import '../styles/Home.css';
import {  Button, Card, CardContent, CardMedia, Container, Grid, IconButton, Typography, Divider } from '@mui/material';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from 'react-scroll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PersonIcon from "@mui/icons-material/Person";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
//assets picture
import campus from "../assets/campus.jpg"
// import graduation from "../assets/graduation.jpg"
// import stu1 from "../assets/stu1.jpg"
// import stu2 from "../assets/stu2.jpg"

function Home() {
  
  const [scroll, setScrollStatus] = useState(false);
 useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once:true
    });
  }, []);
//  const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   autoplay: true,
// };
  useEffect(() => {
    const handleScroll = () => setScrollStatus(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const features = [
    { icon: <DashboardIcon fontSize="large" />, text: "Smart Dashboard", desc: "Intuitive interface for managing all your operations" },
    { icon: <LocationOnIcon fontSize="large" />, text: "Real-Time Tracking", desc: "Live updates on all your deliveries and services" },
    { icon: <BusinessIcon fontSize="large" />, text: "Enterprise Solutions", desc: "Scalable tools for businesses of any size" },
    { icon: <HomeRepairServiceIcon fontSize="large" />, text: "Home Services", desc: "Comprehensive home service management" }
  ];
    const arr = [
    { icon:"https://source.unsplash.com/400x300/?global,university", text: "Operations Management", desc: "Easily manage day-to-day operations, assign tasks, and oversee smooth service operations." },
    { icon: "https://source.unsplash.com/400x300/?global,university", text: "Real-Time Tracking", desc: "Keep track of drivers and service status live, ensuring timely updates." },
    { icon: "https://source.unsplash.com/400x300/?global,university", text: "Customer Communication", desc: " Enable direct communication between staff and customers to resolve issues efficiently and improve satisfaction." },
   
  ];
  
 
  return (
    <>
      {scroll && (
       <IconButton
          
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            zIndex: 9000,
            bottom: 16,
            right: 16,
            backgroundColor: "#01548bff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#003C64",
              transform: "translateY(-3px)"
            }
          }}
>
  <ArrowUpwardIcon sx={{ color: "white" }} />
</IconButton>
      )}

      {/* Modern Header with Gradient */}
       <header className={`main-header ${scroll ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo">
            <span className="logo-main">Univer</span>
            <span className="logo-accent">sity</span>
          </div>
          <nav className="nav-menu">
            <ul>
              <li><Link to="features" smooth={true} duration={500}>Features</Link></li>
              <li><Link to="programs" smooth={true} duration={500}>Programs</Link></li>
              <li><Button 
                variant="contained" 
                color="primary" 
                startIcon={<PersonIcon />}
                className="cta-button2"
              >
                Login
              </Button></li>
              <li><Button 
                variant="contained" 
                color="primary" 
                startIcon={<PersonAddIcon />}
                className="cta-button"
              >
                Apply Now
              </Button></li>
               
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* <Slider {...settings} style={{width:"inherit",heigh:"inherit"}}> */}
        <div className="video-background">
          <CardMedia 
            component="img"
            image={campus}
            alt="University Campus"
          />
          <div className="video-overlay"></div>
        </div>
         {/* <div className="video-background">
          <CardMedia 
            component="img"
            image={graduation}
            alt="University Campus"
          />
          <div className="video-overlay"></div>
        </div> */}
        {/* </Slider> */}
        
        <div className="hero-content" data-aos="fade-down-right">
          <h1 className="hero-title">
            Welcome to <span>UniverSity</span>, <br/> Where <span>Learning</span> Comes Alive
          </h1>
          <p className="hero-subtitle">
            Discover your potential with world-class education, vibrant campus life, and endless opportunities for growth.
          </p>
          <div className="hero-buttons">
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              className="primary-button"
            >
              Explore Programs
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              className="secondary-button"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section" data-aos="zoom-in-left" >
        <Container maxWidth="lg">
          <Typography variant="h2" className="section-title" gutterBottom data-aos="fade-right" data-aos-once="false">
            Why Choose SwiftDriver?
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle">
            Powerful features designed to streamline your operations
          </Typography>
          
          <Grid container spacing={4} className="features-grid">
            {features.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="feature-card" data-aos-delay={index * 100}>
                  <CardContent>
                    <div className="feature-icon">
                      {item.icon}
                    </div>
                    <Typography variant="h5" className="feature-title">
                      {item.text}
                    </Typography>
                    <Typography variant="body2" className="feature-desc">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <Container maxWidth="lg">
          <div className="section-header">
            <Typography variant="h2" className="section-title" data-aos="fade-left" data-aos-once="false">
              Our Comprehensive Services
            </Typography>
            <Typography variant="subtitle1" className="section-subtitle">
              Everything you need in one platform
            </Typography>
          </div>
          
          <Grid container spacing={4} >
            {
              arr.map((item,index)=>(
              <Grid size={6} key={index} data-aos={index%2==0?"fade-left":"fade-right"}>
              <Card className="service-card" sx={{minHeight:"400px"}} >
                <CardMedia 
                  component="img"
                   sx={{ height: 240 }}
                  image={item.icon}
                  alt={item.text}
                  
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                   {item.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" >
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
              ))
            }
          </Grid>
        </Container>
      </section>

      
     
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <Container maxWidth="md">
          <div className="cta-content">
            <Typography variant="h3" className="cta-title">
              Ready to Transform Your Business?
            </Typography>
            <Typography variant="subtitle1" className="cta-subtitle">
              Join thousands of businesses already using SwiftDriver to streamline their operations.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              
              className="cta-button"
            >
              Get Started Today
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        
              <div className="footer-brand">
                <div className="logo">
                  <span className="logo-main">Swift</span>
                  <span className="logo-accent">Driver</span>
                </div>
                <Typography variant="body2" className="footer-text">
                  Smart delivery & home services in one powerful platform.
                </Typography>
                <div className="social-links">
                  <IconButton aria-label="Facebook">
                    <Facebook />
                  </IconButton>
                  <IconButton aria-label="Twitter">
                    <Twitter />
                  </IconButton>
                  <IconButton aria-label="Instagram">
                    <Instagram />
                  </IconButton>
                  <IconButton aria-label="LinkedIn">
                    <LinkedIn />
                  </IconButton>
                </div>
              </div>
        
          <div className="footer-bottom">
            <Typography variant="body2" className="copyright">
              © {new Date().getFullYear()} SwiftDriver. All rights reserved.
            </Typography>
          </div>
        
      </footer>
    </>
  );
}

export default Home;