Instance ID

i-00179d48ba69ed43a (PrivateTennisChicago.com server)
Open an SSH client.
Locate your private key file. The key used to launch this instance is PrivateTennisChicago.pem

Run this command, if necessary, to ensure your key is not publicly viewable.
chmod 400 "PrivateTennisChicago.pem"
Connect to your instance using its Public DNS:
ec2-13-59-18-58.us-east-2.compute.amazonaws.com

Example:
ssh -i "PrivateTennisChicago.pem" ubuntu@ec2-13-59-18-58.us-east-2.compute.amazonaws.com