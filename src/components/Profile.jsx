import React, { useState, useEffect } from 'react'
import { databases, account, storage } from '../appwrite/appwriteConfig';
import { useNavigate, Link } from 'react-router-dom'
import { Query } from 'appwrite';
import conf from '../conf/conf';
import { v4 as uuidv4 } from 'uuid';

function Profile() {
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    setDish(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedDish(dish);
  };

  // avatar
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // getting user details
  const [userDetails, setuserDetails] = useState()
  useEffect(() => {
    const getData = account.get()
    getData.then(
      function (response) {
        setuserDetails(response)
      },
      function (error) {
        console.log(error);
      }
    )
  }, [])

  const handleUpload = async () => {
    if (selectedFile) {
      const response = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollection3Id, [
        Query.equal('user_id', userDetails.$id),
      ]);

      if (response.total > 0) {
        const document = response.documents[0];
        const documentId = document.$id;
        const fileId = uuidv4();
        const oldImageId = response.documents[0].image_id;
        await storage.deleteFile(conf.appwriteBucketId, oldImageId);

        await storage.createFile(conf.appwriteBucketId, fileId, selectedFile);

        const documentData = {
          user_id: String(userDetails.$id),
          image_id: String(fileId),
        };
        const updatedDocument = await databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollection3Id,
          documentId,
          { image_id: String(fileId), }
        );
        console.log('Document updated successfully:', updatedDocument);
      } else {
        try {
          const fileId = uuidv4();
          // Upload the file
          await storage.createFile(conf.appwriteBucketId, fileId, selectedFile);

          const documentData = {
            user_id: String(userDetails.$id),
            image_id: String(fileId),
          };
          const promise = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection3Id, uuidv4(), documentData);

          // Get the file URL
          const fileUrl = `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}&mode=admin`;

          console.log(fileUrl);
          setProfilePictureUrl(fileUrl);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchProfilePictureUrl = async () => {
      try {
        if (!userDetails || !userDetails.$id) return;
        // if (userDetails) {
        const res = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollection3Id, [Query.equal('user_id', userDetails.$id)]);
        setProfilePictureUrl(`${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${res.documents[0].image_id}/view?project=${conf.appwriteProjectId}&mode=admin`);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfilePictureUrl();
  }, [userDetails]);

  // handling logouts
  const handleLogout = async () => {
    try {
      await account.deleteSession("current")
      navigate("/home")
    } catch (error) {
      console.log(error);
    }
  }

  // getting the data from collection(history)
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await account.get();
        setUserId(response.$id);
      } catch (error) {
        console.error('Failed to get user:', error);
      }
    };

    getUser();
  }, []);


  return (
    <>
      {userDetails ? (
        <>
          <div className="min-h-min w-[300px] mx-auto shadow-md flex justify-between text-right py-3 px-3 mt-2 rounded-md">
            <div className='flex flex-col'>
              <div>
                {/* Profile Picture */}
                <div className="absolute top-1 md:top-3 md:right-[10rem] lg:top-10 lg:right-[43rem]">
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    style={{ height: '13rem', width: '12.5rem' }} // Adjust values as needed
                    className="rounded-full cursor-pointer"
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  <button
                    onClick={handleUpload}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Upload Profile Picture
                  </button>
                </div>
                <div>
                  <p className="text-xl text-white">Hello {userDetails.name}</p>
                </div>
              </div>
              <div>
                <button
                  className="bg-red-400 w-40 text-white p-1 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-4">
          Please Login To see Profile{" "}
          <Link to="/">
            <span className="bg-blue-300 p-2 cursor-pointer text-white rounded-md">
              Login
            </span>
          </Link>
        </p>
      )}

    </>
  )
}
export default Profile