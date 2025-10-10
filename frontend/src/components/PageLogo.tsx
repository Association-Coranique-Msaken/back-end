import logo from './../assets/logo.png'

export default function PageLogo() {
  return (
    <>
      <div className='navbar-brand'>
        <img src={logo} alt='logo'></img>
      </div>
       <h4 className='mx-2 my-2 Header-logo-title'>
        الجمهورية التونسية <br /> الجمعية القرآنية بمساكن
      </h4>
    </>
);
}
