"use client"

import * as React from "react"
import Link from "next/link"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {Button} from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"

const navItems = [
    {title: "Trade Ups", href: "/tradeups"},
    {title: "Collections", href: "/collections"},
    {title: "Skins", href: "/skins"},
    {title: "Top Trade Ups", href: "/tradeups/top"},
    {title: "Admin", href: "/admin"},
]

export default function Navbar() {
    return (
        <nav className="flex h-16 items-center justify-between border-b px-6 sticky top-0 z-50 bg-background">

            <span className="text-2xl font-bold">
              <Link href="/">TradeUp Calc</Link>
            </span>

            <NavigationMenu>
                <NavigationMenuList>
                    {navItems.map((item) => (
                        <NavigationMenuItem key={item.href}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                render={<Link href={item.href}>{item.title}</Link>}
                            />
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>


            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon">
                            <Avatar className="size-8">
                                <AvatarImage
                                    src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                                    alt="John Doe"
                                />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="size-10">
                                        <AvatarImage
                                            src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                                            alt="John Doe"
                                        />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <span
                                        className="absolute bottom-0 right-0 block size-2 rounded-full bg-green-600 ring-2 ring-card"/>
                                </div>
                                <div className="flex flex-1 flex-col items-start">
                                    <span className="text-foreground text-lg font-semibold">
                                        John Doe
                                    </span>
                                    <span className="text-muted-foreground text-base">
                                        john.doe@example.com
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator/>

                    <DropdownMenuGroup>
                        <DropdownMenuItem>My account</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator/>

                    <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}