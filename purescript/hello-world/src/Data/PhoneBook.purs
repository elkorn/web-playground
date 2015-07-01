module Data.PhoneBook where

import Data.List
import Data.Maybe

import Control.Plus (empty)

type Entry = {
  firstName :: String,
  lastName :: String,
  phone :: String
  }
             
type PhoneBook = List Entry

