import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Fragment } from "react";

import React from 'react'

interface Props {
    list:{
        name:string;
        href:string;
    }[]
}


export  const BreadcrumbSidebar = ({list}:Props) => {
  return (
   <header className=" flex items-center justify-between w-full">
    <div className=" flex items-center gap-2">

      <SidebarTrigger className=" -ml-1"/>
      <Separator className=" mr-2 h-4" orientation="vertical" />
      <Breadcrumb>
      <BreadcrumbList>
      {list.map((item,_index) => (
        <Fragment key={item.name}>
          <BreadcrumbItem className=" block">
          <BreadcrumbLink href={item.href} asChild={!!item.href}>
          {item.href? (
            <Link href={item.href}> {item.name}</Link>
          ):(
            item.name
          )}
          
          </BreadcrumbLink>
          </BreadcrumbItem>
          {_index +1 < list.length && ( 
            <BreadcrumbSeparator className="bl block" />
          )}

        </Fragment>
      ))}
      
      </BreadcrumbList>
      </Breadcrumb>


     
    </div>

    
   </header>
  )
}

