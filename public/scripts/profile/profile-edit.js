const form = document.querySelector(".edit-profile-container form");
      const inputs = form.querySelectorAll("textarea, input");

      const pathParts = window.location.pathname.split("/"); 
      const profileId = pathParts[2];

      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        try {
          // if there is an image, use formData
          const formData = new FormData(form);

          if (formData.get('image').size > 0) {

          const response = await fetch(`/profile/${profileId}`, {
          method:"PUT",
          body:formData,
        });
        if(response.ok){
         window.location.href=`/profile/${profileId}`
        }else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
          }else{
            //there is no new image, use this formData
            const jsonData = {
            bio: form.bio.value,
            location: form.location.value,
            website: form.website.value,
            socialMedia: {
            twitter: form.twitter.value,
            instagram: form.instagram.value,
            facebook: form.facebook.value,
          },
        };
        const response = await fetch(`/profile/${profileId}`, {
          method:"PUT",
          headers: {'content-type':'application/json',            
          },
          body:JSON.stringify(jsonData),
        });
        if(response.ok){
         window.location.href=`/profile/${profileId}`
        }else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
          }
        } catch (error) {
          showNotification(error,'var(--error-color)');
        }
      });