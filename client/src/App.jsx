import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Process from '../components/Process';
import SignIn from '../components/SignIn';
import Footer from '../components/Footer';


const Index = () => {

  return (
    <div>
      <NavBar />
      <Hero />
      <Features />
      <Process />
      <SignIn />
      <Footer />
    </div>
  );
};

export default Index;