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

showEntry :: Entry -> String

showEntry entry = entry.lastName ++ ", " ++
                  entry.firstName ++ ": " ++
                  entry.phone

emptyBook :: PhoneBook
emptyBook = empty

{-
> :t Data.List.Cons
forall a. a -> List a -> List a

type PhoneBook is just List Entry so it works out of the box.
-}
insertEntry :: Entry -> PhoneBook -> PhoneBook
-- insertEntry entry book = Cons entry book
{- actually, thanks to left-association of function application, we can do an eta conversion and make insertEntry point-free.

insertEntry :: Entry -> PhoneBook -> PhoneBook
insertEntry entry book = Cons entry book
to
insertEntry :: Entry -> PhoneBook -> PhoneBook
insertEntry entry = Cons entry
to
insertEntry :: Entry -> PhoneBook -> PhoneBook
insertEntry = Cons
-}

insertEntry = Cons

findEntry :: String -> String -> PhoneBook -> Maybe Entry
-- findEntry firstName lastName book = head $ filter filterEntry book
--   where
--   filterEntry :: Entry -> Boolean
--   filterEntry entry = entry.firstName == firstName && entry.lastName == lastName
-- Again, we can do an eta conversion.
-- findEntry = head <<< filter filterEntry -- backwards-composition
--   where
--   filterEntry :: Entry -> Boolean
--   filterEntry entry = entry.firstName == firstName && entry.lastName == lastName

findEntry firstName lastName = filter filterEntry >>> head -- forwards-composition
  where
  filterEntry :: Entry -> Boolean
  filterEntry entry = entry.firstName == firstName && entry.lastName == lastName

-- there is no Show instance defined for Maybe Entry
-- we can lift the findEntry result to the Maybe monad:
-- showEntry <$> findEntry "John" "Doe" book
