
import Head from "next/head";


const HeadComponent = () => (
  <Head>
    <script
      src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBjWNDBPa7LaWtKsZ_5YIVSRaIIompaZRA&libraries=places,directions`}
      async
      defer
    ></script>
  </Head>
);


export default HeadComponent;





