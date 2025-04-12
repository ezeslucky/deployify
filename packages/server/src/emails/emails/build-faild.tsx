import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";


export type TemplateProps = {
	projectName: string
   applicationName: string
   applicationType: string
   errorMessage: string
   buildLink: string
   date: string

}


export const BuildFailedEmail = ({
	
})