from setuptools import setup, find_packages

setup(
    name="cloud-sec-ai",
    version="1.0.0",
    description="Python Client SDK for Cloud Misconfiguration AI Platform",
    author="Vijay Mahes",
    author_email="Vijaypradhap2004@gmail.com",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0"
    ]
)
