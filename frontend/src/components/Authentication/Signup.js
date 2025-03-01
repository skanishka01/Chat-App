import React, { useState } from 'react'
import {  VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useHistory } from "react-router";

const Signup = () => {
    const [show,setShow]=useState(false);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [password,setPassword]=useState();
    const [pic,setPic]=useState();
    const [loading, setLoading]=useState(false);
     const toast = useToast();
    const history=useHistory();

    const handleclick=()=>setShow(!show);

    const postDetails=(pics)=>{
        setLoading(true);
        if(pics === undefined){
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            // setLoading(false);
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file",pics);
            data.append("upload_preset","Chit-Chat");
            data.append("cloud_name","daypkdc7f");
            fetch("https://api.cloudinary.com/v1_1/daypkdc7f/image/upload",{
                method:"Post",
                body:data,
            })
            .then((res)=>res.json())
            .then((data)=>{
                setPic(data.url.toString());
                setLoading(false);

            })
            .catch((err)=>{
                console.log(err);
                setLoading(false);
            });
        }   else{
             toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }
    };


    // https://api.cloudinary.com/v1_1/daypkdc7f/image/upload

    const SubmitHandler = async () =>{
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title:"Please Fill all the Fields!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }

        if(password !== confirmpassword){
             toast({
                title:"Please Fill all the Fields!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            return;
        }

        try {
             const config = {
                headers: {
                "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user",
                { name, email, password, pic },
                config
            );
            toast({
                title:"Registration Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            window.dispatchEvent(new Event("storage"));
            setLoading(false);
            history.push('/chats');
        } catch (error) {
             toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
        }

    };

  return (
    <VStack spacing='5px'>
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
            placeholder='Enter Your Name'
            onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>

        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
            placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                type={show? "text" : "password"}
                placeholder='Enter Your Password'
                onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleclick}>
                    {show ? "Hide":"Show"}
                </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                type={show? "text" : "password"}
                placeholder='Confirm your Password'
                onChange={(e)=>setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleclick}>
                    {show ? "Hide":"Show"}
                </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input 
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e)=>postDetails(e.target.files[0])}
            
            />
        </FormControl>

        <Button backgroundColor="red.450" color="white" colorScheme='red'  width="50%" style={{marginTop:14}}  onClick={SubmitHandler} isLoading = {loading} >
            Sign Up
        </Button>

    </VStack>
  )
}

export default Signup
