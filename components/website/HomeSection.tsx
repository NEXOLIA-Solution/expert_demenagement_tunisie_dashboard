"use client"


import AdminGallery from "./AdminGallery/AdminGallery"
// import { CompanySettings } from "./CompanySettings/CompanySettings"
import EmailListManager from "./EmailListManager/EmailListManager"
import GestionFAQ from "./GestionFAQ/GestionFAQ"
import GestionPartners from "./GestionPatners/GestionPartners"
import GestionReviews from "./GestionReviews/GestionReviews"
import GestionVideos from "./GestionVideos/GestionVideos"


export function HomeSection() {

  return (
    <>

      {/* <GestionPartners /> */}
      {/* <GestionVideos /> */}
      <GestionFAQ />
      {/* <GestionReviews /> */}
      {/* <EmailListManager /> */}
      {/* <AdminGallery /> */}

      {/* <QuoteDashboard/> */}     

      {/* <CompanySettings/>
      */}


    </>
  )
}
